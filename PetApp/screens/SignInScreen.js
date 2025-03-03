import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

//import
import { colors } from '../utils/colors';
import {strings} from '../utils/strings';
import {theme} from '../utils/theme';

const { width, height } = Dimensions.get('window');

const SignInScreen = ({ navigation, onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);

  const handleSignInPress = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Call the onSignIn function passed from AuthStack
    onSignIn(email, password);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centerContainer}>
        {/* App Logo */}
        
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/myImages/petAppLogo1.jpg')}
            style={styles.image}
          />
        </View>
        <View>
          <Text style={styles.title}>{strings.appTitle}</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <Text style={styles.inputTitle}>Email*</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password Input */}
          <Text style={styles.inputTitle}>Password*</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <FontAwesome
                name={!isPasswordVisible ? 'eye-slash' : 'eye'}
                size={24}
                color="grey"
              />
            </TouchableOpacity>
          </View>

        
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signInButton} onPress={handleSignInPress}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Or Continue With Section */}
          <Text style={styles.orContinueText}>Or continue with</Text>
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={[styles.socialButton, styles.facebook]}>
              <FontAwesome name="facebook" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.instagram]}>
              <FontAwesome name="instagram" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.google]}>
              <FontAwesome name="google" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpText}>Don't have an account? SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  formContainer: {
    marginTop: height * 0.035,
    width: width * 0.85,
    paddingHorizontal: width * 0.05, // Dynamic padding
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputTitle: {
    alignSelf: 'flex-start',
    fontSize: width * 0.04, // Dynamic font size
    color: colors.darkerGrey,
    marginBottom: height * 0.005, // Dynamic margin
    fontFamily:theme.fonts.regular
  },
  input: {
    width: '100%',
    paddingVertical: height * 0.015, // Dynamic padding
    paddingHorizontal: width * 0.03, // Dynamic padding
    marginBottom: height * 0.02, // Dynamic margin
    borderWidth: width * 0.005, // Dynamic border width
    borderColor: 'tomato',
    borderRadius: width * 0.02, // Dynamic border radius
    backgroundColor: 'white',
    fontFamily:theme.fonts.light
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: width * 0.005, // Dynamic border width
    borderColor: 'tomato',
    borderRadius: width * 0.02, // Dynamic border radius
    backgroundColor: 'white',
    paddingHorizontal: width * 0.03, // Dynamic padding
    marginBottom: height * 0.005, // Dynamic margin
  },
  passwordInput: {
    flex: 1,
    paddingVertical: height * 0.015, // Dynamic padding
    fontFamily:theme.fonts.light
  },
  eyeIcon: {
    paddingHorizontal: width * 0.03, // Dynamic padding
  },
  forgotPasswordText: {
    alignSelf: 'flex-end',
    color: colors.darkerGrey,
    marginBottom: height * 0.025, // Dynamic margin
    fontSize: width * 0.035, // Dynamic font size
    marginLeft:width*0.45,
    fontFamily:theme.fonts.light
  },
  signInButton: {
    width: '100%',
    paddingVertical: height * 0.02, // Dynamic padding
    backgroundColor: colors.tomato,
    borderRadius: width * 0.02, // Dynamic border radius
    alignItems: 'center',
    marginBottom: height * 0.03, // Dynamic margin
  },
  buttonText: {
    color: colors.white,
    fontSize: width * 0.045, // Dynamic font size
    fontFamily:theme.fonts.semibold
  },
  orContinueText: {
    color: colors.darkGrey,
    fontSize: width * 0.04, // Dynamic font size
    marginVertical: height * 0.02, // Dynamic margin
    textAlign: 'center',
    fontFamily:theme.fonts.regular
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%', // Adjust width for spacing
    marginBottom: height * 0.03, // Dynamic margin
  },
  socialButton: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  facebook: {
    backgroundColor: '#3b5998',
  },
  instagram: {
    backgroundColor: '#E4405F',
  },
  google: {
    backgroundColor: '#DB4437',
  },
  signUpText: {
    color: colors.darkerGrey,
    fontSize: width * 0.04, // Dynamic font size
    fontFamily:theme.fonts.semibold
  },
  title: {
    fontSize: 32, // Increased font size for the title
    fontFamily: theme.fonts.semibold,
    textAlign: 'center',
    marginTop:height*0.02,
    marginBottom: height * 0.0,
  },
});

export default SignInScreen;
