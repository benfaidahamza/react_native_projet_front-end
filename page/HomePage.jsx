import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const HomePage = () => {
  const isFocused = useIsFocused();
  const screenHeight = Dimensions.get('window').height;
  const moveAnimation = useRef(new Animated.Value(400)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const cardCount = 3;
  const animationDuration = 600;
  const staggerDelay = 1000;

  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      animateCards(cardCount);
      animateScale();
    }
  }, [isFocused]);

  const animateCard = (index) => {
    return Animated.timing(moveAnimation, {
      toValue: 0,
      duration: animationDuration,
      useNativeDriver: false,
    }).start(() => {
      if (index < cardCount - 1) {
        setTimeout(() => {
          animateCard(index + 1);
        }, staggerDelay);
      }
    });
  };

  const animateCards = useCallback((index) => {
    moveAnimation.setValue(400);
    animateCard(0);
  }, []);

  const animateScale = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 1.1, 
        duration: animationDuration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: animationDuration / 2,
        useNativeDriver: true,
      }),
    ]).start(() => {
      animateScale();
    });
  };

  const handleCardPress = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { height: screenHeight * 0.6 }]}>
        <Animated.Image
          source={require('../assets/img/coeur.png')}
          style={[styles.image, { transform: [{ scale: scaleAnimation }] }]}
          resizeMode="contain"
        />
      </View>

      <Animated.View style={[styles.descriptionContainer, { transform: [{ translateY: moveAnimation }] }]}>
        <View style={styles.infoBox}>
          <Text style={styles.descriptionText}>
            Bienvenue dans notre application ! C'est un endroit où vous pouvez trouver toutes vos informations médicales,
            prendre rendez-vous, et gérer vos dossiers de santé en toute simplicité. Connectez-vous dès maintenant pour
            commencer à utiliser toutes les fonctionnalités.
          </Text>
        </View>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleCardPress}>
          <Animated.View style={[styles.button, { transform: [{ translateX: moveAnimation }] }]}>
            <Text style={styles.buttonText}>Connexion</Text>
          </Animated.View>
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
  imageContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height:700
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'lightblue',
    marginTop: -100,
  },
  infoBox: {
    padding: 10,
    width:'90%'
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginTop:10,
    marginBottom: 20,
  },
  button: {
    width: '100%',
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

export default HomePage;
