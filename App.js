import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, useTheme } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TabScreen from './TabScreen';

const App = () => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const theme = isDarkMode ? DarkTheme : DefaultTheme;
  const customTheme = useTheme();
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  return (
    <NavigationContainer theme={theme}>
      <View style={[styles.container, { backgroundColor: customTheme.colors.background }]}>
        <TabScreen />
        <TouchableOpacity onPress={toggleDarkMode} style={styles.modeButton}>
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={24}
            color={isDarkMode ? 'lightblue' : 'black'}
          />
        </TouchableOpacity>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  tabContainer: {
    flex: 1,
    position: 'relative',
  },

  modeButton: {
    position: 'absolute',
    top: 43,
    right: 10,
    padding: 10,
  },
});

export default App;
