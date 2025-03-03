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

// Import colors
import { colors } from '../utils/colors';
import {strings} from '../utils/strings';
import {theme} from '../utils/theme';

const { width, height } = Dimensions.get('window');

const SignUpScreen = ({ navigation, onSignUp }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isUsernameFocused, setUsernameFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);


  const [usernameValidation, setUsernameValidation] = useState({
    isLengthValid: false,
    isNoSpecialChars: false,
  });

  const [passwordValidation, setPasswordValidation] = useState({
    isLengthValid: false,
    hasCapitalLetter: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [isEmailValid, setEmailValid] = useState(false);

  const validateUsername = (username) => ({
    isLengthValid: username.length >= 3 && username.length <= 20,
    isNoSpecialChars: /^[a-zA-Z0-9 ]*$/.test(username),
  });

  const validatePassword = (password) => ({
    isLengthValid: password.length >= 6 && password.length <= 20,
    hasCapitalLetter: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignUpPress = () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if(!isEmailValid){
      Alert.alert('Error','Incorrect email format.');
      return;
    }

    if(!usernameValidation.isLengthValid||!usernameValidation.isNoSpecialChars){
      Alert.alert('Error','Incorrect username format');
      return;
    }

    if(!passwordValidation.hasCapitalLetter||!passwordValidation.hasNumber||!passwordValidation.hasSpecialChar||!passwordValidation.isLengthValid){
      Alert.alert('Error','Incorrect password format');
      return;
    }

    // Call the onSignUp function if validations pass
    onSignUp(username, email, password);
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
          {/* Username Input */}
          <Text style={styles.inputTitle}>Username*</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameValidation(validateUsername(text));
            }}
            autoCapitalize="none"
            onFocus={() => setUsernameFocused(true)}
            onBlur={() => setUsernameFocused(false)}
          />
          {isUsernameFocused && (
            <View>
              <View style={styles.validationRow}>
                <FontAwesome
                  name={usernameValidation.isLengthValid ? 'check' : 'times'}
                  size={16}
                  color={usernameValidation.isLengthValid ? 'green' : 'red'}
                />
                <Text style={styles.validationText}>
                  At least 3 and max 20 characters
                </Text>
              </View>
              <View style={styles.validationRow}>
                <FontAwesome
                  name={usernameValidation.isNoSpecialChars ? 'check' : 'times'}
                  size={16}
                  color={usernameValidation.isNoSpecialChars ? 'green' : 'red'}
                />
                <Text style={styles.validationText}>
                  No special characters
                </Text>
              </View>
            </View>
          )}

          {/* Email Input */}
          <Text style={styles.inputTitle}>Email*</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailValid(validateEmail(text));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
          {isEmailFocused && (
            <View style={styles.validationRow2}>
              <FontAwesome
                name={isEmailValid ? 'check' : 'times'}
                size={16}
                color={isEmailValid ? 'green' : 'red'}
              />
              {isEmailValid?
                (<Text style={styles.validationText}>Valid email format</Text>):
                (<Text style={styles.validationText}>Invalid email format</Text>)
              }
            </View>
          )}

          {/* Password Input */}
          <Text style={styles.inputTitle}>Password*</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordValidation(validatePassword(text));
              }}
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
          {isPasswordFocused && (
            <View style={{marginBottom:height*0.01}}>
              <View style={styles.validationRow}>
                <FontAwesome
                  name={passwordValidation.isLengthValid ? 'check' : 'times'}
                  size={16}
                  color={passwordValidation.isLengthValid ? 'green' : 'red'}
                />
                <Text style={styles.validationText}>
                  At least 6 and max 20 characters
                </Text>
              </View>
              <View style={styles.validationRow}>
                <FontAwesome
                  name={passwordValidation.hasCapitalLetter ? 'check' : 'times'}
                  size={16}
                  color={passwordValidation.hasCapitalLetter ? 'green' : 'red'}
                />
                <Text style={styles.validationText}>
                  At least 1 capital letter
                </Text>
              </View>
              <View style={styles.validationRow}>
                <FontAwesome
                  name={passwordValidation.hasNumber ? 'check' : 'times'}
                  size={16}
                  color={passwordValidation.hasNumber ? 'green' : 'red'}
                />
                <Text style={styles.validationText}>At least 1 number</Text>
              </View>
              <View style={styles.validationRow}>
                <FontAwesome
                  name={passwordValidation.hasSpecialChar ? 'check' : 'times'}
                  size={16}
                  color={passwordValidation.hasSpecialChar ? 'green' : 'red'}
                />
                <Text style={styles.validationText}>
                  At least 1 special character
                </Text>
              </View>
            </View>
          )}

          {/* Confirm Password Input */}
          <Text style={styles.inputTitle}>Confirm Password*</Text>
          <View style={styles.confirmPasswordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setPasswordMatch(text === password);
              }}
              secureTextEntry
              autoCapitalize="none"
            />
            
            <TouchableOpacity
              onPress={() =>
                setConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
              style={styles.eyeIcon}
            >
              <FontAwesome
                name={!isConfirmPasswordVisible ? 'eye-slash' : 'eye'}
                size={24}
                color="grey"
              />
            </TouchableOpacity>
            
          </View>

          {!passwordMatch && (
              <View style={styles.instructionContainer2}>
                <FontAwesome name="times-circle" size={16} color="red" />
                <Text style={styles.instructionText}>Passwords do not match</Text>
              </View>
            )}
          
          {/* Sign Up Button */}
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUpPress}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Navigate to Sign In */}
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.signInText}>Already have an account? SIGN IN</Text>
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
    marginBottom: height * 0.01, // Dynamic margin
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
    marginBottom: height * 0.02, // Dynamic margin
  },
  confirmPasswordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: width * 0.005, // Dynamic border width
    borderColor: 'tomato',
    borderRadius: width * 0.02, // Dynamic border radius
    backgroundColor: 'white',
    paddingHorizontal: width * 0.03, // Dynamic padding
 // Dynamic margin
  },
  passwordInput: {
    flex: 1,
    paddingVertical: height * 0.015, // Dynamic padding
    fontFamily:theme.fonts.light
  },
  eyeIcon: {
    paddingHorizontal: width * 0.03, // Dynamic padding
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  instructionText: {
    marginLeft: width * 0.02, // Spacing next to the icon
    color: colors.tomato,
    fontSize: width * 0.035, // Dynamic font size
    fontFamily:theme.fonts.light
  },
  instructionContainer2:{
    marginTop:height*0.015,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight:width*0.27
  },
  signUpButton: {
    width: '100%',
    paddingVertical: height * 0.02, // Dynamic padding
    backgroundColor: colors.tomato,
    borderRadius: width * 0.02, // Dynamic border radius
    alignItems: 'center',
    marginBottom: height * 0.03, // Dynamic margin
    marginTop: height * 0.05,
  },
  buttonText: {
    color: colors.white,
    fontSize: width * 0.045, // Dynamic font size
    fontFamily:theme.fonts.semibold
  },
  signInText: {
    color: colors.darkerGrey,
    fontSize: width * 0.04, // Dynamic font size
    fontFamily:theme.fonts.semibold
  },
  validationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.005,
    marginRight:width*0.16
  },
  validationRow2: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.005,
    marginRight:width*0.38
  },
  validationText: {
    marginLeft: width * 0.02,
    fontSize: width * 0.035,
    color: colors.darkGrey,
    fontFamily:theme.fonts.light
  },
  title: {
    fontSize: 32, // Increased font size for the title
    fontFamily:theme.fonts.semibold,
    textAlign: 'center',
    marginTop:height*0.02,
    marginBottom: height * 0.0,
  },
  
});

export default SignUpScreen;