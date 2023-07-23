import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const RegisterUsers = (  ) => {

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [role, setRole] = useState('');
  const [nomError, setNomError] = useState(false);
  const [prenomError, setPrenomError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [motDePasseError, setMotDePasseError] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    const formData = {
      nom,
      prenom,
      email,
      motDePasse,
      role,
    };
    if (!nom || !prenom || !email || !motDePasse || !role) {
      setNomError(!nom);
      setPrenomError(!prenom);
      setEmailError(!email);
      setMotDePasseError(!motDePasse);
      return;
    }
    try {
      const storedToken = await AsyncStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      const response = await axios.post(`http://192.168.1.178:3000/api/users/CreateUser`, formData);
      console.log('User registration successful:', response.data);
      navigation.navigate('Admin');
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inscription</Text>
      <TextInput
        style={[styles.input, nomError && styles.inputError]}
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
        onFocus={() => setNomError(false)}
      />
      <TextInput
        style={[styles.input, prenomError && styles.inputError]}
        placeholder="Prénom"
        value={prenom}
        onChangeText={setPrenom}
        onFocus={() => setPrenomError(false)}
      />
      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setEmailError(false)}
      />
      <TextInput
        style={[styles.input, motDePasseError && styles.inputError]}
        placeholder="Mot de passe"
        secureTextEntry={true}
        value={motDePasse}
        onChangeText={setMotDePasse}
        onFocus={() => setMotDePasseError(false)}
      />
      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>Sélectionnez le rôle :</Text>
        <TouchableOpacity
          style={role === 'RH' ? styles.radioButtonChecked : styles.radioButton}
          onPress={() => setRole('RH')}
        >
          <Text style={styles.radioText}>RH</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={role === 'docteur' ? styles.radioButtonChecked : styles.radioButton}
          onPress={() => setRole('docteur')}
        >
          <Text style={styles.radioText}>Docteur</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={role === 'Admin' ? styles.radioButtonChecked : styles.radioButton}
          onPress={() => setRole('Admin')}
        >
          <Text style={styles.radioText}>Admin</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    marginRight: 10,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonChecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioText: {
    color: 'blue',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default RegisterUsers;