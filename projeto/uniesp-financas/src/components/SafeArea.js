import React from 'react';
import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';

export default function SafeArea({ children }) {
  return (
    <SafeAreaView style={styles.container}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  }
});