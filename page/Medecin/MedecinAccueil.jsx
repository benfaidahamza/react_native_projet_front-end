import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const MedecinAccueil = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    getNameFromStorage();
  }, []);

  const getNameFromStorage = async () => {
    try {
      const storedName = await AsyncStorage.getItem('nom');
      if (storedName) {
        setName(storedName);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du nom:', error);
    }
  };

  const isFocused = useIsFocused();
  const screenHeight = Dimensions.get('window').height;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFocused) {
      animateScale();
    }
  }, [isFocused]);

  const animateScale = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 1.1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      animateScale();
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="user" size={60} color="black" />
        <Text style={styles.nameText}> Bonjour {name}</Text>
      </View>
      <View style={[styles.imageContainer, { height: screenHeight * 0.6 }]}>
        <Animated.Image
          source={require('../../assets/img/coeur.png')}
          style={[styles.image, { transform: [{ scale: scaleAnimation }] }]}
          resizeMode="contain"
        />
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
  imageContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 700,
  },
  iconContainer: {
    marginTop:200,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MedecinAccueil;
