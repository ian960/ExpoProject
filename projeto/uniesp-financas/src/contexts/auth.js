import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Fallback para ambiente web
if (Platform.OS === 'web') {
  SecureStore.getItemAsync = async (key) => {
    return localStorage.getItem(key);
  };
  SecureStore.setItemAsync = async (key, value) => {
    localStorage.setItem(key, value);
  };
  SecureStore.deleteItemAsync = async (key) => {
    localStorage.removeItem(key);
  };
}

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorage() {
      try {
        const token = await SecureStore.getItemAsync('user_token');
        if (token) {
          api.defaults.headers['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/me');
          setUser(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar token', error);
      } finally {
        setLoading(false);
      }
    }
    loadStorage();
  }, []);

  async function signUp(name, email, password) {
    setLoadingAuth(true);
    try {
      await api.post('/users', {
        name,
        email,
        password
      });
      setLoadingAuth(false);
      return true;
    } catch (err) {
      console.log("ERRO AO CADASTRAR", err);
      setLoadingAuth(false);
      return false;
    }
  }

  async function signIn(email, password) {
    setLoadingAuth(true);
    try {
      const response = await api.post('/login', {
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      
      await SecureStore.setItemAsync('user_token', token);
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      setLoadingAuth(false);
      return true;
    } catch (err) {
      console.log("ERRO AO LOGAR ", err);
      setLoadingAuth(false);
      return false;
    }
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('user_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ 
      signed: !!user, 
      user, 
      signUp, 
      signIn, 
      signOut, 
      loadingAuth, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;