import React, { useState, useContext } from 'react';
import { Platform, ActivityIndicator, Alert } from 'react-native';
import {
  Background,
  Container,
  Logo,
  AreaInput,
  Input,
  SubmitButton,
  SubmitText,
  Link,
  LinkText
} from './styles';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';
import SafeArea from '../../components/SafeArea';

export default function SignIn() {
  const navigation = useNavigation();
  const { signIn, loadingAuth } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    const success = await signIn(email, password);
    
    if (success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
    } else {
      Alert.alert('Erro', 'Credenciais inválidas ou problema no servidor');
    }
  }

  return (
    <SafeArea>
      <Background>
        <Container
          behavior={Platform.OS === 'ios' ? 'padding' : ''}
          enabled
        >
          <Logo
            source={require('../../assets/Logo.png')}
          />

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

          <SubmitButton activeOpacity={0.8} onPress={handleLogin}>
            {
              loadingAuth ? (
                <ActivityIndicator size={20} color="#FFF" />
              ) : (
                <SubmitText>Acessar</SubmitText>
              )
            }
          </SubmitButton>

          <Link onPress={() => navigation.navigate('SignUp')}>
            <LinkText>Criar uma conta!</LinkText>
          </Link>
        </Container>
      </Background>
    </SafeArea>
  );
}