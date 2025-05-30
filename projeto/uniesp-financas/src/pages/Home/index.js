import React, { useState } from 'react';
import { FlatList, View, Dimensions, TouchableOpacity, Text, RefreshControl, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';
import Header from '../../components/Header';
import { formatCurrency } from '../../utils/format';
import Loading from '../../components/Loading';
import { useFinance } from '../../contexts/finance';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import api from '../../services/api';
import SafeArea from '../../components/SafeArea';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const cardWidth = screenWidth * 0.7;
const cardMargin = 10;
const snapInterval = cardWidth + cardMargin;
const cardHeight = screenHeight * 0.12;

const Background = styled.View`
  flex: 1;
  background-color: #F0F4FF;
`;

const Container = styled.View`
  flex: 1;
  padding: 15px;
`;

const CarouselCard = styled.View`
  background-color: ${props => props.bgColor};
  border-radius: 4px;
  padding: 10px;
  margin-right: ${cardMargin}px;
  elevation: 3;
  align-items: flex-start;
  justify-content: flex-end;


  width: ${cardWidth}px;
  height: ${cardHeight}px;
`;

const CarouselTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #FFFFFF;
  margin-top: 50px;
`;

const CarouselValue = styled.Text`
  font-size: 24px;
  color: #FFFFFF;
  margin-top: 0px;
`;

const SectionTitle = styled.View`
  font-size: 18px;
  font-weight: bold;
  color: #FFFFFF;
  margin-top: 0px;
  justify-content: space-between;
`;

const SectionIcon = styled(Icon)`
  margin-right: 10px;
`;

const SectionText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
`;

const MovementItem = styled.View`
  background-color: #FFFFFF;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  elevation: 2;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const TypeContainer = styled.View`
  background-color: ${props => props.type === 'receita' ? '#00B94A' : '#EF463A'};
  padding: 5px 10px;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
`;

const TypeText = styled.Text`
  color: #FFFFFF;
  font-weight: bold;
  margin-left: 5px;
`;

const ValueText = styled.Text`
  font-size: 16px;
  color: #000000;
`;

const FilterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const FilterText = styled.Text`
  margin-left: 10px;
  font-size: 16px;
`;

const EmptyText = styled.Text`
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
`;

const DeleteButton = styled.TouchableOpacity`
  margin-left: 10px;
`;

export default function Home() {
  const { 
    balance, 
    movements, 
    selectedDate, 
    setSelectedDate,
    loading,
    fetchFinanceData,
    removeMovement
  } = useFinance();
  
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onRefresh = () => {
    fetchFinanceData();
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleDelete = async (movementId, value, type) => {
    try {
      await api.delete('/receives/delete', {
        params: { item_id: movementId }
      });
      
      removeMovement(movementId, value, type);
      Alert.alert('Sucesso', 'Movimentação removida com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar movimentação:', error);
      Alert.alert('Erro', 'Falha ao remover movimentação');
    }
  };

  const renderCarouselItem = ({ item }) => (
    <CarouselCard bgColor={item.bgColor}>
      <Icon name={item.icon} size={40} color="#FFFFFF" />
      <CarouselTitle>{item.title}</CarouselTitle>
      <CarouselValue>{formatCurrency(item.value)}</CarouselValue>
    </CarouselCard>
  );

  const renderMovementItem = ({ item }) => (
    <MovementItem>
      <TypeContainer type={item.type}>
        <Icon
          name={item.type === 'receita' ? 'arrow-up' : 'arrow-down'}
          size={20}
          color="#FFFFFF"
        />
        <TypeText>{item.type === 'receita' ? 'Receita' : 'Despesa'}</TypeText>
      </TypeContainer>
      
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text>{item.description}</Text>
        <ValueText>{formatCurrency(item.value)}</ValueText>
      </View>
      
      <DeleteButton onPress={() => handleDelete(item.id, item.value, item.type)}>
        <Icon name="trash-2" size={20} color="#FF0000" />
      </DeleteButton>
    </MovementItem>
  );

  const carouselData = [
    {
      title: 'Saldo Atual',
      value: balance.saldo || 0,
      bgColor: '#3B3DBF',
    },
    {
      title: 'Entradas de Hoje',
      value: balance.receita || 0,
      bgColor: '#00B94A',

    },
    {
      title: 'Saídas de Hoje',
      value: balance.despesa || 0,
      bgColor: '#EF463A',
      
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeArea>
      <Background>
        <Header title="Home" />
        <Container>
          
          <View style={{ height: 150, marginTop: 0 }}>
            <FlatList
              data={carouselData}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={snapInterval}
              decelerationRate="fast"
              renderItem={renderCarouselItem}
              keyExtractor={(item, index) => String(index)}
              contentContainerStyle={{ paddingHorizontal: cardMargin }}
            />
          </View>
          
          <SectionTitle>
            <FilterButton onPress={() => setShowDatePicker(true)}>
              <Icon name="calendar" size={20} color="#000" />
              <FilterText>
                <SectionText>Últimas Movimentações</SectionText>
              </FilterText>
            </FilterButton>
          </SectionTitle>
          
          {movements.length === 0 ? (
            <EmptyText>Nenhuma movimentação registrada nesta data</EmptyText>
          ) : (
            <FlatList
              data={movements}
              renderItem={renderMovementItem}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={onRefresh}
                  colors={['#3B3DBF']}
                />
              }
            />
          )}
          
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            date={selectedDate}
            onConfirm={handleDateConfirm}
            onCancel={() => setShowDatePicker(false)}
          />
        </Container>
      </Background>
    </SafeArea>
  );
}
