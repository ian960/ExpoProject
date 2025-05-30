import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from './src/routes';
import AuthProvider from './src/contexts/auth';
import { FinanceProvider } from './src/contexts/finance';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FinanceProvider>
          <NavigationContainer>
            <StatusBar backgroundColor="#F0F4FF" barStyle="dark-content" />
            <Routes />
          </NavigationContainer>
        </FinanceProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}