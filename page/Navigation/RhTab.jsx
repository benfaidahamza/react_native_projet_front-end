import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import RhAccueil from '../Rh/RhAccueil';
import Deconnexion from './Deconnexion';
import ScanCode from '../ScanCode';
import PatientPage from '../PatientPage';

const Tab = createMaterialTopTabNavigator();

const RhTab = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('role');
      await AsyncStorage.removeItem('nom');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTab' }],
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <Tab.Navigator
      tabBarOptions={{
        style: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
        activeTintColor: colors.primary,
        inactiveTintColor: colors.text,
      }}
    >
      <Tab.Screen
        name="Home"
        component={RhAccueil}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? 'home' : 'home-outline'}
              size={26}
              color={color}
            />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Liste"
        component={PatientPage}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? 'format-list-bulleted' : 'format-list-bulleted-type'}
              size={26}
              color={color}
            />
          ),
          tabBarLabel: 'liste',
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanCode}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={26}
              color={color}
            />
          ),
          tabBarLabel: 'Scan'
       }}
      />
       <Tab.Screen
        name="Deconnexion"
        component={Deconnexion}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name="logout"
              size={26}
              color={color}
            />
          ),
          tabBarLabel: 'Logout',
        }}
        listeners={{
          tabPress: () => handleLogout()
        }}
      />
    </Tab.Navigator>
  );
};

export default RhTab;
