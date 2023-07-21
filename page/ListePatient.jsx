import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme  } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const PatientPage = () => {

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchText, setSearchText] = useState('');
  const { colors } = useTheme();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      const response = await axios.get('http://10.74.3.97:3000/api/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des patients:', error);
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const closeModal = () => {
    setSelectedPatient(null);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.nom.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchText.toLowerCase())
  );
  
  const windowWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
    <View style={styles.centeredView}>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher les patients par nom.."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
    </View>

    <View style={styles.cardContainer}>
      {filteredPatients.map((patient, index) => (
        <TouchableOpacity
          key={patient._id}
          style={[styles.patientCard, { width: windowWidth / 2 - 5 }, { color: colors.text }]} // Réduire la largeur à la moitié de l'écran et enlever les marges
          onPress={() => handlePatientClick(patient)}
        >
          <Text style={styles.patientName}>{patient.nom} {patient.prenom}</Text>
          {patient.sexe === "Masculin" && <Icon name="mars" size={20} color="blue" />}
          {patient.sexe === "Féminin" && <Icon name="venus" size={20} color="pink" />}
        </TouchableOpacity>
      ))}
    </View>

      <Modal visible={!!selectedPatient} animationType="slide">
        <View style={styles.modalContainer}>
          {selectedPatient && (
            <View>
              <Text style={styles.modalName}>{selectedPatient.nom} {selectedPatient.prenom}</Text>
              <Text style={styles.modalAge}>Age : {selectedPatient.age} ans</Text>
              <Text style={styles.modalAge}>Poids : {selectedPatient.poids} kg</Text>
              <Text style={styles.modalAge}>Taille : {selectedPatient.taille} cm</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        flexDirection: 'column',
        justifyContent: 'center',
      },
      centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      },
      patientCard: {
        borderWidth: 2,
        padding: 20,
        marginVertical: 5,
        alignItems: 'center'
      },
      patientName: {
        marginBottom: 10,
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray',
      },
      modalName: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalAge: {
        fontSize: 15,
        marginTop: 10,
        color: 'white',
        textAlign: 'center',
      },
      closeButton: {
        marginTop: 40,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: '#eee',
        borderRadius: 5,
      },
      closeButtonText: {
        textAlign: 'center',
        color: '#333',
        fontWeight: 'bold',
      },
      searchBar: {
        justifyContent: 'center',
        padding: 10,
        margin: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
      },
});

export default PatientPage;

