import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
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
  height: 50px;
`;

const SelectRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  height: 50px;
`;

const SelectButton = styled.TouchableOpacity`
  background-color: ${props => (props.selected ? '#FFFFFF' : '#F0F4FF')};
  padding: 10px;
  border-radius: 5px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  flex: 1;
  margin-right: ${props => props.marginRight || '0px'};
`;

const SelectText = styled.Text`
  color: #171717;
  margin-left: 5px;
`;

const SaveButton = styled.TouchableOpacity`
  background-color:#00B94A;
  padding: 15px;
  border-radius: 5px;
  align-items: center;
  margin-top: 10px;
  opacity: ${props => (props.disabled ? 0.6 : 1)};
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
      const movementData = {
        description,
        value: parseFloat(value),
        type,
        date: new Date().toISOString(), // adicionando a data no formato ISO
      };

      const response = await api.post('/receive', movementData);

      addMovement({
        ...response.data,
        ...movementData
      });

      Alert.alert('Sucesso', 'Movimentação registrada com sucesso!');

      setValue('');
      setDescription('');
      setType('receita');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
    } catch (error) {
      console.error('Erro completo:', error.response ? error.response.data : error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Falha ao registrar movimentação');
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

          <SelectRow>
            <SelectButton
              selected={type === 'receita'}
              type="receita"
              marginRight="5px"
              onPress={() => setType('receita')}
            >
              <Icon name="arrow-up" size={16} color="#171717" />
              <SelectText>Receita</SelectText>
            </SelectButton>

            <SelectButton
              selected={type === 'despesa'}
              type="despesa"
              onPress={() => setType('despesa')}
            >
              <Icon name="arrow-down" size={16} color="#171717" />
              <SelectText>Despesa</SelectText>
            </SelectButton>
          </SelectRow>

          <SaveButton onPress={handleSave} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <SaveText>Registrar</SaveText>
            )}
          </SaveButton>
        </Content>
      </Container>
    </SafeArea>
  );
}
