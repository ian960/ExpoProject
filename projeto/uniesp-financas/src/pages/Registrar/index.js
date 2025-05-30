import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { useFinance } from '../../contexts/finance';
import SafeArea from '../../components/SafeArea';

const Container = styled.View`
  flex: 1;
  background-color: #F0F4FF;
`;

const Content = styled.View`
  flex: 1;
  padding: 20px;
`;

const Input = styled.TextInput`
  background-color: #FFFFFF;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const SelectButton = styled.TouchableOpacity`
  background-color: ${props => props.selected ? (props.type === 'receita' ? '#28A745' : '#DC3545') : '#FFFFFF'};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  align-items: center;
`;

const SelectText = styled.Text`
  color: ${props => props.selected ? '#FFFFFF' : '#000000'};
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #3B3DBF;
  padding: 15px;
  border-radius: 5px;
  align-items: center;
  margin-top: 10px;
  opacity: ${props => props.disabled ? 0.6 : 1};
`;

const SaveText = styled.Text`
  color: #FFFFFF;
  font-weight: bold;
`;

export default function Registrar() {
  const navigation = useNavigation();
  const { addMovement } = useFinance();
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('receita');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!value || isNaN(parseFloat(value))) {
      Alert.alert('Erro', 'Preencha o valor corretamente.');
      return;
    }
    
    if (!description) {
      Alert.alert('Erro', 'Preencha a descrição.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Formatar data para DD/MM/YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      
      const movementData = {
        description,
        value: parseFloat(value),
        type,
        date: formattedDate
      };
      
      const response = await api.post('/receive', movementData);
      
      // Adiciona a nova movimentação ao contexto
      addMovement({
        ...response.data,
        ...movementData
      });
      
      Alert.alert('Sucesso', 'Movimentação registrada com sucesso!');
      
      // Resetar campos
      setValue('');
      setDescription('');
      setType('receita');
      setDate(new Date());
      
      // Navegar para Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
      
    } catch (error) {
      console.error('Erro completo:', error);
      Alert.alert('Erro', 'Falha ao registrar movimentação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeArea>
      <Container>
        <Header title="Registrar Movimentação" />

        <Content>
          <Input
            placeholder="Valor"
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />
          
          <Input
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
          />
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
            <SelectButton 
              selected={type === 'receita'} 
              type="receita" 
              onPress={() => setType('receita')}
            >
              <SelectText selected={type === 'receita'}>Receita</SelectText>
            </SelectButton>
            
            <SelectButton 
              selected={type === 'despesa'} 
              type="despesa" 
              onPress={() => setType('despesa')}
            >
              <SelectText selected={type === 'despesa'}>Despesa</SelectText>
            </SelectButton>
          </View>
          
        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)}
          style={{ 
            backgroundColor: '#FFF', 
            padding: 10, 
            borderRadius: 5,
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Text>Data: {date.toLocaleDateString('pt-BR')}</Text>
          <Icon name="calendar" size={20} color="#000" />
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
        
        <SaveButton onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <SaveText>Salvar</SaveText>
          )}
        </SaveButton>
      </Content>
    </Container>
    </SafeArea>
  );
}
        