import { useTheme,useNavigation  } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Image, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import * as Calendar from 'expo-calendar';
import * as MailComposer from 'expo-mail-composer';


const PatientPage = () => {

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false); 
  const [patientModalVisible, setPatientModalVisible] = useState(false); 
  const { colors } = useTheme();
  const customTheme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      const response = await axios.get('http://192.168.1.178:3000/api/patients');
      console.log(response.data)
      setPatients(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des patients:', error);
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setPatientModalVisible(true);
  };

  const handleDeletePatient = async () => {
    try {
      await axios.delete(`http://192.168.1.178:3000/api/patients/${selectedPatient._id}`);
      console.log('Patient deleted successfully!')
      setPatients((prevPatients) => prevPatients.filter((patient) => patient._id !== selectedPatient._id));
      closeModal();
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleTakeAppointment = () => {
    console.log('Take appointment clicked!');
    setAppointmentModalVisible(true);
    closeModal();
  };

  const closeModal = () => {
    setPatientModalVisible(false);
  };

  const closeAppointmentModal = () => {
    setAppointmentModalVisible(false);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.nom.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchText.toLowerCase())
  );

  const numColumns = 1;

  const renderItem = ({ item }) => (
    
      <TouchableOpacity onPress={() => handlePatientClick(item)}>
        <View style={styles.patientCard}>
          <Image style={styles.patientImage} source={{ uri: item.imageUrl }} />
          <Text style={[styles.patientName, { color: colors.text }]}>{item.nom} {item.prenom}</Text>
        </View>
      </TouchableOpacity>
      
  );

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleGoToFichePatient = () => {
    if (selectedPatient) {
      navigation.navigate('Register', { patientId: selectedPatient._id });
      closeModal();
    }
  };


 useEffect(() => {
    checkCalendarPermissions();
  }, []);
 const checkCalendarPermissions = async () => {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permission required',
      'Please grant calendar access to add events.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
  }

  const { status: remindersStatus } = await Calendar.requestRemindersPermissionsAsync();
  if (remindersStatus !== 'granted') {
    Alert.alert(
      'Permission required',
      'Please grant reminders access to add events.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
  }
};

const getDefaultCalendar = async () => {
    const calendars = await Calendar.getCalendarsAsync();
    const defaultCalendar = calendars.find((cal) => cal.allowsModifications && !cal.isPrimary);
    return defaultCalendar;
  };
  
  const sendEmail = async () => {
    try {
      const emailContent = `Bonjour,\n\nVous avez un nouveau rendez-vous intitulé "${title}".\n\nDate de début: "${formatDateTime(startDate)}"\nDate de fin: 
      "${formatDateTime(endDate)}"\n\nBonne journée`;
      await MailComposer.composeAsync({
        recipients: selectedPatient.email, 
        subject: 'Nouveau rendez-vous',
        body: emailContent,
      });
    } catch (error) {
      console.log('Error sending email:', error);
    }
  };
  const handleAddEvent = async () => {
    try {
      const defaultCalendar = await getDefaultCalendar();
      if (!defaultCalendar) {
        Alert.alert('Error', 'No default calendar found.');
        return;
      }
  
      if (endDate && startDate && endDate < startDate) {
        Alert.alert('Error', "La date de fin n'est pas valide.");
        return;
      }
  
      const event = {
        title: title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };
      const eventId = await Calendar.createEventAsync(defaultCalendar.id, event);
      await sendEmail();
      setAppointmentModalVisible(false);
    } catch (error) {
      console.log('Error adding event:', error);
    }
    
  };
  
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    setStartDate(selectedDate || startDate);
  };
  
  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    setEndDate(selectedDate || endDate);
  };
  
  const formatDateTime = (date) => {
    if (!date) return '';
    return date.toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Liste des patients</Text>
      <View style={styles.centeredView}>
        <TextInput
          style={styles.searchBar}
          placeholder="Rechercher les patients par nom.."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>

      <FlatList
        data={filteredPatients}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={numColumns}
        contentContainerStyle={styles.cardContainer}
      />

    <Modal visible={patientModalVisible} animationType="slide">
          <View style={[styles.modalContainer, { backgroundColor: customTheme.colors.background }]}>
          {selectedPatient && (
            <View>
              <Image style={styles.modalImage} source={{ uri: selectedPatient.imageUrl }} />
              <Text style={[styles.modalName, { color: colors.text }]}>{selectedPatient.nom} {selectedPatient.prenom}</Text>
              <View style={styles.modalSexeContainer}>
                {selectedPatient.sexe === "Masculin" && <Icon name="mars" size={20} color="blue" />}
                {selectedPatient.sexe === "Féminin" && <Icon name="venus" size={20} color="pink" />}
              </View>
              <Text style={[styles.modalEmail, { color: colors.text }]}>{selectedPatient.email}</Text>
              <Text style={[styles.modalAge, { color: colors.text }]}>Age : {selectedPatient.age} ans</Text>
              <Text style={[styles.modalAge, { color: colors.text }]}>Poids : {selectedPatient.poids} kg</Text>
              <Text style={[styles.modalAge, { color: colors.text }]}>Taille : {selectedPatient.taille} cm</Text>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity onPress={handleGoToFichePatient} style={[ styles.modalButton,{backgroundColor:'blue'}]}>
                  <Text style={styles.fichePatientButtonText}>Fiche Patient</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity onPress={handleTakeAppointment} style={[styles.appointmentButton, styles.modalButton]}>
                    <Text style={styles.appointmentButtonText}>RDV</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal} style={[styles.closeButton, styles.modalButton]}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
      <View style={[styles.container1, { backgroundColor: customTheme.colors.background, borderWidth: 2, borderColor: 'blue', borderRadius: 10 }]}></View>
      <Modal visible={appointmentModalVisible} animationType="slide">
       {selectedPatient && (

          <View style={[styles.container1, { backgroundColor: customTheme.colors.background }]}>
          <Text style={[styles.label2,{ color: colors.text }]}>Rendez-vous avec {selectedPatient.nom} {selectedPatient.prenom}</Text>
          <Text style={[styles.label1,{ color: colors.text }]}>Titre de l'événement:</Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={title}
            onChangeText={(text) => setTitle(text)}
            placeholder="Entrez le titre de l'événement"
          />
          <Text style={[styles.label,{ color: colors.text }]}>Date de début:</Text>
          <Text style={[styles.input,{ color: colors.text }]} onPress={() => setShowStartDatePicker(true)}>
            {formatDateTime(startDate) || 'Sélectionnez la date de début'}
          </Text>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={handleStartDateChange}
              textColor="black"
            />
          )}

          <Text style={[styles.label,{ color: colors.text }]}>Date de fin:</Text>
          <Text style={[styles.input,{ color: colors.text }]} onPress={() => setShowEndDatePicker(true)}>
            {formatDateTime(endDate) || 'Sélectionnez la date de début'}
          </Text>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={handleEndDateChange}
              textColor="gray"
            />
          )}
        <View style={[styles.modalButtonsContainer, { backgroundColor: customTheme.colors.background }]}>
          <TouchableOpacity onPress={handleAddEvent} style={[styles.closeButton, styles.modalButton, { backgroundColor: 'green' }]}>
            <Text style={styles.closeButtonText}>Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeAppointmentModal} style={[styles.closeButton, styles.modalButton, { backgroundColor: 'red' }]}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        </View>
   )}
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
  patientCard: {
    borderWidth: 2,
    padding: 5,
    marginVertical: 5,
    alignItems: 'center',
    borderColor: 'gray',
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
  },
  patientImage: {
    marginLeft: 25,
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  fichePatientButtonText:{
    color: 'white', 
    fontWeight: 'bold',
  },
  patientName: {
    marginLeft: 35,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalName: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalEmail: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalAge: {
    fontSize: 15,
    marginTop: 10,
    color: 'white',
    textAlign: 'center',
  },
  closeButton: {
    marginLeft: 5,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchBar: {
    justifyContent: 'center',
    width: 260,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  modalImage: {
    width: 160,
    height: 160,
    borderRadius: 100,
    marginBottom: 20,
  },
  modalSexeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
  appointmentButton: {
    borderColor: 'green',
    marginRight: 5,
    backgroundColor: 'green', // Ajout du background vert
  },
  appointmentButtonText: {
    color: 'white', // Texte en blanc
    fontWeight: 'bold',
  },
  container1: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label1: {
    marginTop: 50,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label2: {
    marginTop: 80,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 10,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  takeAppointmentButton: {
    backgroundColor: 'green',
  },
  goToPatientFormButton: {
    backgroundColor: 'blue',
  },
  closeButton: {
    backgroundColor: 'red',
  },
  patientDetailsContainer: {
    padding: 20,
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default PatientPage;