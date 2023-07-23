import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [email, setemail] = useState('');
  const [motDePasse, setmotDePasse] = useState('');
  const { colors } = useTheme();
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      setError('');
      const response = await axios.post('http://192.168.1.178:3000/api/auth/login', { email, motDePasse });
      const token = response.data.token;
      const role = response.data.role;
      const nom = response.data.nom;

      if (token) {
        console.log(token);
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('role', role);
        await AsyncStorage.setItem('nom', nom);
        if (role === 'RH') {
          navigation.navigate('RH');
        } else if (role === 'Docteur') {
          navigation.navigate('Medecin');
        } else if (role === 'Administrateur') {
          navigation.navigate('Admin');
        }
      } else {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
      }
    } catch (error) {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
      console.error(error);
    }
  };

  const backgroundColor = isDarkMode ? '#121212' : colors.background;
  const caretColor = isDarkMode ? 'white' : 'black';
  const isemailEmpty = email === '';
  const ismotDePasseEmpty = motDePasse === '';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.formContainer, { width: '90%', height: '75%' }]}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/img/docteur.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Login</Text>
        {error !== '' && <Text style={styles.errorText}>{error}</Text>}
        <View style={[
          styles.inputContainer,
          { borderColor: isemailEmpty || error !== '' ? 'red' : 'lightblue' }
        ]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="email"
            placeholderTextColor={colors.text}
            value={email}
            onChangeText={setemail}
            caretColor={caretColor} 
          />
        </View>

        <View style={[
          styles.inputContainer,
          { borderColor: ismotDePasseEmpty || error !== '' ? 'red' : 'lightblue' }
        ]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="mot de passe"
            secureTextEntry
            placeholderTextColor={colors.text}
            value={motDePasse}
            onChangeText={setmotDePasse}
            caretColor={caretColor} 
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: 'lightblue' }]}
          onPress={handleLogin}
          disabled={isemailEmpty || ismotDePasseEmpty}
        >
          <Icon name="sign-in" size={20} color="white" style={styles.loginButtonIcon} />
          <Text style={[styles.loginButtonText, { color: 'white' }]}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    borderWidth: 2,
    borderColor: 'lightblue',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    marginTop: 90,
    borderRadius: 100,
    overflow: 'hidden',
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
  },
  loginButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 8,
  },
});

export default LoginPage;
