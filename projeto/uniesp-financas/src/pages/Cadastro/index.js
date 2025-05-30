import React, { useState, useContext } from 'react';
import { Platform, ActivityIndicator, Alert } from 'react-native';
import {
  Background,
  Container,
  AreaInput,
  Input,
  SubmitButton,
  SubmitText
} from '../Login/styles';
import { AuthContext } from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import SafeArea from '../../components/SafeArea';

export default function SignUp() {
  const navigation = useNavigation();
  const { signUp, loadingAuth } = useContext(AuthContext);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp() {
    if (nome === '' || email === '' || password === '') {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    const success = await signUp(nome, email, password);
    
    if (success) {
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      navigation.goBack();
    } else {
      Alert.alert('Erro', 'Não foi possível criar a conta');
    }
  }

  return (
    <SafeArea>
      <Background>
        <Container
          behavior={Platform.OS === 'ios' ? 'padding' : ''}
          enabled
        >
          <AreaInput>
            <Input
              placeholder="Nome"
              value={nome}
              onChangeText={(text) => setNome(text)}
            />
          </AreaInput>

          <AreaInput>
            <Input
              placeholder="Seu email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </AreaInput>

          <AreaInput>
            <Input
              placeholder="Sua senha"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
            />
          </AreaInput>

          <SubmitButton onPress={handleSignUp}>
            {
              loadingAuth ? (
                <ActivityIndicator size={20} color="#FFF" />
              ) : (
                <SubmitText>Cadastrar</SubmitText>
              )
            }
          </SubmitButton>
        </Container>
      </Background>
    </SafeArea>
  );
}