import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 



export default function RegisterPage({route}) {
  const { patientId } = route.params || { patientId: '' };
  console.log({ patientId })
   const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [treatmentsData, setTreatmentsData] = useState([]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get(`http://192.168.1.178:3000/api/patients/${patientId}`)
      .then((response) => {
        const patientDataFromServer = response.data;
        setNom(patientDataFromServer.nom);
        setPrenom(patientDataFromServer.prenom);
        setEmail(patientDataFromServer.email);
        setTreatmentsData(
          patientDataFromServer.traitements.map((treatment) => ({
            nom: treatment.nom,
            duree: treatment.duree.toString(),
            fois_par_jour: treatment.fois_par_jour.toString(),
          }))
        );
        setWeight(patientDataFromServer.poids.toString());
        setHeight(patientDataFromServer.taille.toString());
        setAge(patientDataFromServer.age.toString());
        setGender(patientDataFromServer.sexe);
        console.log('Patient Data:', response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching patient data:', error);
        setError('Error fetching patient data');
        setIsLoading(false);
      });
  }, [patientId]);
  const navigateToListPage = () => {
    navigation.navigate('Medecin');
  };
  const handleGenderChange = (newGender) => {
    setGender(newGender);
  };
  console.log(prenom)

  const handleAddTreatment = () => {
    if (newTreatment.nom && newTreatment.duree && newTreatment.fois_par_jour) {
      setTreatmentsData([...treatmentsData, newTreatment]);
      setNewTreatment({
        nom: '',
        duree: '',
        fois_par_jour: ''
      }); 
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Please fill all fields in the new treatment.');
    }
  };

  const handleValidate = async () => {
    const formData = {
      nom: nom,
      prenom: prenom,
      email: email,
      traitements:treatmentsData.map(treatment => ({
        nom: treatment.nom,
        duree: treatment.duree,
        fois_par_jour: treatment.fois_par_jour,
      })),
      sexe: gender,
      age: age,
    };
  
    try {
      const storedToken = await AsyncStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      const response = await axios.put(`http://192.168.1.178:3000/api/patients/${patientId}`, formData);
      console.log('Data updated successfully!', response.data);
    } catch (error) {
      console.error('Error updating data:', error);
    }
    console.log(JSON.stringify(formData, null, 2));
  };

  const renderItem = ({ item }) => {
    return (
      <Text style={styles.selectedTreatmentText}>
        {item.nom}
      </Text>
    );
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [newTreatment, setNewTreatment] = useState({
    nom: '',
    duree: '',
    fois_par_jour: ''
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fiche Patient</Text>
      
    
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={prenom}
          onChangeText={setPrenom}
          editable={false}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          editable={false}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="calendar" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
      <TouchableOpacity style={styles.addTreatmentButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addTreatmentButtonText}>Add Treatment</Text>
      </TouchableOpacity>
      <View style={styles.selectedTreatmentsContainer}>
        <FlatList
          data={treatmentsData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
        />
      </View>

      {/* Modal to add new treatment */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Treatment</Text>
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Treatment Name:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter Treatment Name"
                value={newTreatment.nom}
                onChangeText={(text) => setNewTreatment({ ...newTreatment, nom: text })}
              />
            </View>
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Duration (days):</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter Duration"
                keyboardType="numeric"
                value={newTreatment.duree}
                onChangeText={(text) => setNewTreatment({ ...newTreatment, duree: text })}
              />
            </View>
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Frequency per Day:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter Frequency"
                keyboardType="numeric"
                value={newTreatment.fois_par_jour}
                onChangeText={(text) => setNewTreatment({ ...newTreatment, fois_par_jour: text })}
              />
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddTreatment}>
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.validateButton, { marginRight: 10 }]} onPress={handleValidate}>
          <Icon name="check" size={20} color="white" style={styles.validateButtonIcon} />
          <Text style={styles.validateButtonText}>Validate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.validateButton, { marginLeft: 10 }]} onPress={navigateToListPage}>
          <Icon name="list" size={20} color="white" style={styles.validateButtonIcon} />
          <Text style={styles.validateButtonText}>Go to List</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioButtons: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioButtonLabel: {
    fontSize: 16,
    marginRight: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  inputContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  input: {
    color :'black',
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  addTreatmentButton: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  addTreatmentButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedTreatmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  selectedTreatmentText: {
    backgroundColor: 'lightgray',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  validateButton: {
    flexDirection: 'row',
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft:'10'
  },
  validateButtonIcon: {
    marginRight: 8,
  },
  validateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  patientImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalInputContainer: {
    marginBottom: 20,
  },
  modalInputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalInput: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  modalPicker: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalCancelButton: {
    backgroundColor: 'red',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});