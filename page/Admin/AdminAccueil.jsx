import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminAccueil = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Bonjour Admin</Text>
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

export default AdminAccueil;
