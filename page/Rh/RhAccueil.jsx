import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RhAccueil = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Bonjour RH</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default RhAccueil;
