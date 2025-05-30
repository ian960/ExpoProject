import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Container, Title, ButtonMenu } from './styles';
import { colors } from '../../styles/colors';

export default function Header({ title }) {
  const navigation = useNavigation();

  return (
    <Container>
      <ButtonMenu
        onPress={() => navigation.openDrawer()}
        accessibilityLabel="Abrir menu"
        accessibilityHint="Navegação entre telas"
        accessibilityRole="button"
      >
        <Icon name="menu" size={30} color={colors.preto} />
      </ButtonMenu>
      {title && <Title>{title}</Title>}
    </Container>
  );
}