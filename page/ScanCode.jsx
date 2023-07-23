import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, TextInput, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScanCode = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQRData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    image: '',
  });

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setQRData(data);

    try {
      const response = await axios.get(data);
      const userData = response.data.results[0];

      const nom = userData.name.last;
      const prenom  = userData.name.first;
      const email = userData.email;
      const age = userData.dob.age.toString();
      const sexe = userData.gender;
      const imageUrl = userData.picture.large;

      setFormData({
        nom,
        prenom,
        email,
        age,
        sexe,
        imageUrl,
      });

      Alert.alert('User Information', 'User data scanned successfully!');
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'An error occurred while fetching data');
    }
  };

  const handleSubmit = async () => {
    console.log(formData)
    try {
      const storedToken = await AsyncStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      const response = await axios.post('http://192.168.1.178:3000/api/patients/Createpatient', formData);
      console.log('Form data submitted to the backend:', response.data);
      Alert.alert('Form Submitted', 'Form data submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting form data:', error);
      Alert.alert('Error', 'An error occurred while submitting form data');
    }
  };

  const handleResetScan = () => {
    setScanned(false);
    setQRData(null);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Camera access permission denied</Text>;
  }

  return (
    <View style={styles.container}>
      {scanned ? (
       <View style={styles.formContainer}>
       <Text style={styles.title}>User Information</Text>
       <TextInput
         style={styles.input}
         placeholder="First Name"
         value={formData.prenom}
         onChangeText={(text) => setFormData({ ...formData, prenom: text })}
       />
       <TextInput
         style={styles.input}
         placeholder="Last Name"
         value={formData.nom}
         onChangeText={(text) => setFormData({ ...formData, nom: text })}
       />
       <TextInput
         style={styles.input}
         placeholder="Email"
         value={formData.email}
         onChangeText={(text) => setFormData({ ...formData, email: text })}
       />
       <TextInput
         style={styles.input}
         placeholder="Age"
         value={formData.age}
         onChangeText={(text) => setFormData({ ...formData, age: text })}
       />
       <TextInput
         style={styles.input}
         placeholder="Gender"
         value={formData.sexe}
         onChangeText={(text) => setFormData({ ...formData, sexe: text })}
       />
       <TextInput
         style={styles.input}
         placeholder="Image URL"
         value={formData.imageUrl}
         onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
       />
        <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Validate</Text>
        </TouchableOpacity>
        <View style={styles.buttonSpacer} />
        <TouchableOpacity onPress={handleResetScan} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Retry</Text>
        </TouchableOpacity>
        </View>

     </View>
      ) : (
        <BarCodeScanner
          style={styles.camera}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  camera: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSpacer: {
    width: 20, 
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'Black',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScanCode;