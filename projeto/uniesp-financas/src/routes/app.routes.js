import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Home from '../pages/Home';
import MeuPerfil from '../pages/MeuPerfil';
import Registrar from '../pages/Registrar';
import { colors } from '../styles/colors';
import { Image, Text, View } from 'react-native';
import Logo from '../assets/Logo.png';

const AppDrawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: colors.branco }}>

      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Image
          source={Logo}
          style={{
            width: 160,
            height: 160,
            resizeMode: 'contain',
          }}
        />
      </View>


      <Text style={{
        textAlign: 'center',
        fontSize: 18,
        marginVertical: 10,
        fontWeight: 'bold',
        color: colors.preto
      }}>
        Bem-vindo
      </Text>

    
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function AppRoutes() {
  return (
    <AppDrawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: colors.branco },
        drawerActiveBackgroundColor: colors.azul,
        drawerActiveTintColor: colors.branco,
        drawerInactiveBackgroundColor: colors.brancoEscuro,
        drawerInactiveTintColor: colors.preto,
        drawerItemStyle: {
          marginVertical: 8,
          borderRadius: 0, 
        },
      }}
    >
      <AppDrawer.Screen name="Home" component={Home} />
      <AppDrawer.Screen name="Registrar" component={Registrar} />
      <AppDrawer.Screen name="Meu Perfil" component={MeuPerfil} />
    </AppDrawer.Navigator>
  );
}

export default AppRoutes;
