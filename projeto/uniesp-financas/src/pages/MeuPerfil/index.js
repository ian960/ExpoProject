import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import Header from '../../components/Header';
import { AuthContext } from '../../contexts/auth';
import SafeArea from '../../components/SafeArea';

const Background = styled.View`
  flex: 1;
  background-color: #F0F4FF;
`;

const Container = styled.View`
  flex: 1;
  padding: 15px;
`;

const ProfileInfo = styled.View`
  background-color: #FFFFFF;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  elevation: 2;
`;

const ProfileText = styled.Text`
  font-size: 16px;
  color: #000000;
  margin-bottom: 10px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #EF463A;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin-top: 20px;
`;

const SubmitText = styled.Text`
  color: #FFFFFF;
  font-weight: bold;
  font-size: 18px;
`;

export default function MeuPerfil() {
  const { user, signOut, loadingAuth } = useContext(AuthContext);

  return (
    <SafeArea>
      <Background>
        <Header title="Perfil" />
        <Container>
          <ProfileInfo>
            <ProfileText>Nome: {user?.name}</ProfileText>
            <ProfileText>Email: {user?.email}</ProfileText>
          </ProfileInfo>
          
          <SubmitButton onPress={signOut} disabled={loadingAuth}>
            {loadingAuth ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <SubmitText>Sair</SubmitText>
            )}
          </SubmitButton>
        </Container>
      </Background>
    </SafeArea>
  );
}