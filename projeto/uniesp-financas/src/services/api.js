import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'http://192.168.1.12:3333',
});

// Interceptor para adicionar token às requisições
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

export default api;