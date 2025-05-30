import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../pages/Home';
import MeuPerfil from '../pages/MeuPerfil';
import Registrar from '../pages/Registrar';
import { colors } from '../styles/colors';

const AppDrawer = createDrawerNavigator();

function AppRoutes() {
  return (
    <AppDrawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: colors.branco, paddingTop: 20 },
        drawerActiveBackgroundColor: colors.azul,
        drawerActiveTintColor: colors.branco,
        drawerInactiveBackgroundColor: colors.brancoEscuro,
        drawerInactiveTintColor: colors.preto,
      }}
    >
      <AppDrawer.Screen name="Home" component={Home} />
      <AppDrawer.Screen name="Registrar" component={Registrar} />
      <AppDrawer.Screen name="MeuPerfil" component={MeuPerfil} />
    </AppDrawer.Navigator>
  );
}

export default AppRoutes;