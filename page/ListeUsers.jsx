import { useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Button, Image, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ListeUsers = () => {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [userModalVisible, setUserModalVisible] = useState(false); 
  const { colors } = useTheme();
  const customTheme = useTheme();
  const navigation = useNavigation();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      const response = await axios.get('http://192.168.1.178:3000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const handleGoToUserMod = () => {
      setEditedUser(selectedUser);
      setEditModalVisible(true);
      closeModal(); 
  }

  const handleInputChange = (field, value) => {
    setEditedUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `http://192.168.1.178:3000/api/users/${selectedUser._id}`, editedUser
      );

      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === editedUser._id ? { ...user, ...editedUser } : user
          )
        );

        setEditModalVisible(false);
      } else {
        console.log('Failed to update user:', response.data);
      }
    } catch (error) {
      console.log('Error updating user:', error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUserModalVisible(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://192.168.1.178:3000/api/users/${selectedUser._id}`);
      console.log('User deleted successfully!')
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== selectedUser._id));
      closeModal();
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleCancel = () => {
    setEditModalVisible(false);
  }

  const closeModal = () => {
    setUserModalVisible(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nom.toLowerCase().includes(searchText.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchText.toLowerCase())
  );

  const numColumns = 1;

  const renderItem = ({ item }) => (

    <TouchableOpacity onPress={() => handleUserClick(item)}>
      <View style={styles.userCard}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.userName, { color: colors.text }]}>{item.nom} {item.prenom}</Text>
        </View>
        <View style={styles.containerRole}>
          <Text style={styles.userRole}>{item.role}</Text>
        </View>
      </View>
    </TouchableOpacity>

  );

  return (
    <View style={styles.container}>

      <View style={styles.centeredView}>
        <TextInput
          style={styles.searchBar}
          placeholder="Rechercher les utilisateurs par nom.."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={numColumns}
        contentContainerStyle={styles.cardContainer}
      />

      <Modal visible={userModalVisible} animationType="slide">
        <View style={[styles.modalContainer, { backgroundColor: customTheme.colors.background }]}>
          {selectedUser && (
            <View>
              <View style={styles.containerModalRole}>
                <Text style={styles.modalUserRole}>{selectedUser.role}</Text>
              </View>
              <Text style={[styles.modalName, { color: colors.text }]}>{selectedUser.nom} {selectedUser.prenom}</Text>
              <Text style={[styles.modalEmail, { color: colors.text }]}>{selectedUser.email}</Text>
              <View style={styles.ficheButtonContainer}>
                <TouchableOpacity onPress={handleGoToUserMod} style={[styles.ficheUserButton, styles.modalButton]}>
                  <Text style={styles.ficheUserButtonText}>Modifier</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity onPress={handleDeleteUser} style={[styles.deleteButton, styles.modalButton]}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal} style={[styles.closeButton, styles.modalButton]}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
      <Modal visible={editModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>La modification des informations</Text>
          <TextInput
            style={styles.input}
            value={editedUser.nom}
            onChangeText={(text) => handleInputChange('nom', text)}
            placeholder="Nom"
          />
          <TextInput
            style={styles.input}
            value={editedUser.prenom}
            onChangeText={(text) => handleInputChange('prenom', text)}
            placeholder="Prénom"
          />
          <TouchableOpacity onPress={handleSaveChanges} style={styles.validerButton}>
            <Text style={styles.validerButtonText}>Valider</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
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
  userCard: {
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
  containerRole: {
    borderWidth: 2,
    padding: 5,
    marginVertical: 5,
    borderColor: 'gray',
    flexDirection: 'row',
    borderRadius: 10,
  },
  containerModalRole: {
    borderWidth: 2,
    padding: 5,
    marginVertical: 5,
    borderColor: 'lightblue',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 80
  },
  userImage: {
    marginLeft: 25,
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  userName: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'lightblue'
  },
  modalUserRole: {
    fontSize: 36,
    fontWeight: 'bold',
    alignContent: 'center',
    color: 'lightblue',
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
    marginBottom: 10
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
    borderColor: '#333',
    borderRadius: 5,
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#333',
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
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButton: {
    borderColor: 'red',
    marginLeft: 5,
  },
  deleteButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
  ficheButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
  },
  ficheUserButton: {
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
  },
  ficheUserButtonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  validerButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: '50%',
    alignSelf: 'center',
  },
  validerButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: '50%',
    alignSelf: 'center',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ListeUsers;
