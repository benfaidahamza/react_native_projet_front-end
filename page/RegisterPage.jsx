import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RadioButton as PaperRadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
const patientData = {
  "nom": "Dupont",
  "prenom": "Jean",
  "age": 35,
  "poids": 70,
  "taille": 180,
  "traitements": [
    {
      "nom": "Paracétamol",
      "duree": 7,
      "fois_par_jour": 3
    },
    {
      "nom": "Ibuprofène",
      "duree": 5,
      "fois_par_jour": 2
    }
  ]
};

export default function RegisterPage() {
    const [patientName, setPatientName] = useState(`${patientData.prenom} ${patientData.nom}`);
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [medicationName, setMedicationName] = useState(patientData.traitements[0].nom);
    const [usageDuration, setUsageDuration] = useState(`${patientData.traitements[0].duree}`);
    const [usagePerDay, setUsagePerDay] = useState(`${patientData.traitements[0].fois_par_jour}`);
    const [selectedTreatment, setSelectedTreatment] = useState(0);
    const [treatmentsData, setTreatmentsData] = useState(patientData.traitements.map(treatment => ({
      nom: treatment.nom,
      duree: treatment.duree.toString(),
      fois_par_jour: treatment.fois_par_jour.toString()
    })));
    const [weight, setWeight] = useState(`${patientData.poids}`);
    const [height, setHeight] = useState(`${patientData.taille}`);
    const [age, setAge] = useState(`${patientData.age}`);
    const [gender, setGender] = useState('male'); // Initially select male as the default gender
  
    const handleGenderChange = (newGender) => {
      setGender(newGender);
    };
  
    const handleAddTreatment = () => {
      setTreatmentsData([...treatmentsData, newTreatment]);
      setModalVisible(false);
    };
  
    const handleValidate = () => {
      // Implement your validation logic here
      console.log('Patient Name:', patientName);
      console.log('Email:', email);
      console.log('Phone Number:', phoneNumber);
      console.log('Medication Name:', medicationName);
      console.log('Usage Duration:', usageDuration);
      console.log('Usage Per Day:', usagePerDay);
      console.log('Selected Treatments:', treatmentsData.map(treatment => treatment.nom));
      console.log('Gender:', gender);
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
      <Text style={styles.title}>fiche patient </Text>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Patient Name"
          value={patientName}
          onChangeText={setPatientName}
        />
      </View>
      {/* ... Other input fields ... */}
      <View style={styles.radioContainer}>
        {/* ... Radio buttons ... */}
      </View>
      {/* ... Other input fields ... */}
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

      <TouchableOpacity style={styles.validateButton} onPress={handleValidate}>
        <Icon name="check" size={20} color="white" style={styles.validateButtonIcon} />
        <Text style={styles.validateButtonText}>Validate</Text>
      </TouchableOpacity>
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
  inputContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  input: {
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
  },
  validateButtonIcon: {
    marginRight: 8,
  },
  validateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
