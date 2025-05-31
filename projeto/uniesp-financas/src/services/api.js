import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: 'http://192.168.1.12:3333',
});

api.interceptors.request.use(async config => {
  try {
    const token = await SecureStore.getItemAsync('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return config;
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na resposta:', {
      url: error.config.url,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      Alert.alert('Sessão expirada', 'Por favor, faça login novamente');
    }

    return Promise.reject(error);
  }
);

export default api;