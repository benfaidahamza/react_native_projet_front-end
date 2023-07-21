import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme, useTheme } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomePage from './page/HomePage';
import LoginPage from './page/LoginPage';
import PatientPage from './page/PatientPage';
import RegisterPage from './page/RegisterPage';
import { lightTheme, darkTheme } from './page/theme';
import RhAccueil from './page/Rh/RhAccueil';
import AdminAccueil from './page/Admin/AdminAccueil';
import MedecinAccueil from './page/Medecin/MedecinAccueil';
import { createStackNavigator } from '@react-navigation/stack';

const App = () => {
  const Tab = createMaterialTopTabNavigator();
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

  const Stack = createStackNavigator();
  return (
    <NavigationContainer theme={theme}>
      {/* <Stack.Navigator>
        <Stack.Screen name="Admin" component={AdminAccueil} />
        <Stack.Screen name="Medecin" component={MedecinAccueil} />
        <Stack.Screen name="RH" component={RhAccueil} />
      </Stack.Navigator> */}
      <View style={[styles.container, { backgroundColor: customTheme.colors.background }]}>
        <View style={styles.tabContainer}>
          <Tab.Navigator
            tabBarOptions={{
              activeTintColor: isDarkMode ? darkTheme.activeIcon : customTheme.colors.primary,
              inactiveTintColor: isDarkMode ? darkTheme.inactiveIcon : customTheme.colors.text,
              style: {
                backgroundColor: isDarkMode ? darkTheme.card : lightTheme.card,
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                elevation: 0,
              },
              labelStyle: {
                fontSize: 12,
                fontWeight: 'bold',
              },
              indicatorStyle: {
                backgroundColor: customTheme.colors.primary,
              },
            }}
          >
            <Tab.Screen
              name="Home"
              component={HomePage}
              options={{
                tabBarIcon: ({ focused, color }) => (
                  <Ionicons
                    name={focused ? 'home' : 'home-outline'}
                    size={24}
                    color={isDarkMode ? darkTheme.activeIcon : color}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Liste"
              component={PatientPage}
              options={{
                tabBarIcon: ({ focused, color }) => (
                  <Ionicons
                    name={focused ? 'list' : 'list-outline'}
                    size={24}
                    color={isDarkMode ? darkTheme.activeIcon : color}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Login"
              component={LoginPage}
              options={{
                tabBarIcon: ({ focused, color }) => (
                  <Ionicons
                    name={focused ? 'log-in' : 'log-in-outline'}
                    size={24}
                    color={isDarkMode ? darkTheme.activeIcon : color}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Register"
              component={RegisterPage}
              options={{
                tabBarIcon: ({ focused, color }) => (
                  <Ionicons
                    name={focused ? 'pencil' : 'pencil-outline'}
                    size={24}
                    color={isDarkMode ? darkTheme.activeIcon : color}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="RH"
              component={RhAccueil}
              options={{
                tabBarStyle: {display:'none'}
              }}
            />
          </Tab.Navigator>
        </View>
        <TouchableOpacity onPress={toggleDarkMode} style={styles.modeButton}>
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={24}
            color={isDarkMode ? darkTheme.activeIcon : darkTheme.inactiveIcon}
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
