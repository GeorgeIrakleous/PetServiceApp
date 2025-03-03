import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

//import
import {strings} from '../utils/strings';
import {theme} from '../utils/theme';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const handleEnterApp = () => {
    navigation.replace('SignIn');
  };

  return (
    <View style={styles.container}>
      {/* Top Half with Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/myImages/manWalkingWithDog.jpg')}
          style={styles.image}
        />
      </View>

      {/* Bottom Half */}
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Welcome to {strings.appTitle}</Text>
        <TouchableOpacity style={styles.button} onPress={handleEnterApp}>
          <FontAwesome name="arrow-right" size={50} color="white" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/myImages/petAppLogo1.jpg')}
            style={styles.logo}
          />
          <Text style={styles.logoText}>{strings.appTitle}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: {
    position: 'absolute', // Allow the image to overlap the bottom container
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.55, // Extend slightly to fill gaps#
    overflow:'hidden'
  },
  image: {
    transform:[
      {scaleX:1.15}
    ],
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    
  },
  bottomContainer: {
    flex: 1,
    marginTop: height * 0.5, // Push content below the image
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32, // Increased font size for the title
    fontFamily:theme.fonts.semibold,
    textAlign: 'center',
    marginTop:height*0.02,
    marginBottom: height * 0.0,
  },
  button: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 500,
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginRight: width * 0.03,
  },
  logoText: {
    fontSize: 18,
    color: 'black',
    fontFamily:theme.fonts.medium
  },
});

export default WelcomeScreen;
