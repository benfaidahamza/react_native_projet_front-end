import React, {useState,useEffect} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomePage from './page/HomePage';
import LoginPage from './page/LoginPage';
import PatientPage from './page/PatientPage';
import RegisterPage from './page/RegisterPage';
import MedecinAccueil from './page/Medecin/MedecinAccueil';
import { useTheme } from '@react-navigation/native';
import AdminAccueil from './page/Admin/AdminAccueil';
import MedecinTab from './page/Navigation/MedecinTab';
import Deconnexion from './page/Navigation/Deconnexion';
import RhTab from './page/Navigation/RhTab';
import AdminTab from './page/Navigation/AdminTab';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const MainTabScreen = () => {
  const { colors } = useTheme();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);
      } catch (error) {
        console.error('Error while checking token:', error);
      }
    };

    checkToken();
  }, []);

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
        component={HomePage}
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
      {token ? (
        <>
          <Tab.Screen
            name="Liste"
            component={PatientPage}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <MaterialCommunityIcons name="menu" size={26} color={color} />
              ),
              tabBarLabel: 'List',
            }}
          />
          <Tab.Screen
            name="Register"
            component={RegisterPage}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <MaterialCommunityIcons
                  name={focused ? 'pencil' : 'pencil-outline'}
                  size={26}
                  color={color}
                />
              ),
              tabBarLabel: 'Register',
            }}
          />
        </>
      ) : (
        <Tab.Screen
          name="Login"
          component={LoginPage}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <MaterialCommunityIcons name="login" size={26} color={color} />
            ),
            tabBarLabel: 'Login',
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const TabScreen = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="MainTab" component={MainTabScreen} />
      <Stack.Screen name="RH" component={RhTab} />
      <Stack.Screen name="Medecin" component={MedecinTab} />
      <Stack.Screen name="Admin" component={AdminTab} />
      <Stack.Screen name="Deconnexion" component={Deconnexion} />
    </Stack.Navigator>
  );
};

export default TabScreen;
