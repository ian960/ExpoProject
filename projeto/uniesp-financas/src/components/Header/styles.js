import styled from 'styled-components/native';
import { colors } from '../../styles/colors';

export const Container = styled.SafeAreaView`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: ${colors.brancoEscuro};
  padding: 15px;
  width: 100%;
  height: 60px;
  
`;

export const Title = styled.Text`
  font-size: 20px;
  color: ${colors.preto};
  font-weight: bold;
  margin-left: 10px;
`;

export const ButtonMenu = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  pointer-events: auto; /* Adicione esta linha */
`;