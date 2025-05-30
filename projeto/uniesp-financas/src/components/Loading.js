import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../styles/colors';

export default function Loading({ size = 'large', color = colors.azul }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.brancoEscuro }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}