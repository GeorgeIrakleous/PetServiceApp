import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

//import
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import {strings} from '../utils/strings';

const Stack = createStackNavigator();

const AuthStack = ({ onSignIn }) => {

  // Function to handle sign-in logic
  const handleSignIn = async (email, password) => {
    try {
      // Make API call to the backend to verify credentials
      const response = await axios.post(`${strings.baseURL}/auth/login`, { email, password });

      // Get the token from the response
      const token = response.data.token;

      // Store the token in AsyncStorage or another secure storage method
      await AsyncStorage.setItem('userToken', token);

      // If the API call is successful, set the user as authenticated
      onSignIn();
    } catch (error) {
      console.log(error);
      // Handle errors (e.g., show an alert)
      Alert.alert('Login Failed', error.response?.data?.message || 'An error occurred');
    }
  };

  // Function to handle sign-up logic
  const handleSignUp = async (username,email, password, navigation) => {
    try {
      // Make API call to the backend to register the user
      const response = await axios.post(`${strings.baseURL}/auth/register`, { username,email, password });

      // Check if the response contains a token
      const token = response.data.token;

      // Store the token in AsyncStorage or another secure storage method
      await AsyncStorage.setItem('userToken', token);

      // Alert the user that the account was created
      Alert.alert('Account created successfully');
      
      // Navigate to the SignIn screen
      navigation.navigate('SignIn');
  
    } catch (error) {
      console.log('catch:', error);
      // Handle errors (e.g., show an alert)
      Alert.alert('Signup Failed', error.response?.data?.message || 'An error occurred');
    }
  };
  
  return (
    <Stack.Navigator
      initialRouteName="Welcome" 
      screenOptions={{ headerShown: false }}
    >
      {/* Welcome Screen */}
      <Stack.Screen name="Welcome">
        {(props) => <WelcomeScreen {...props} />}
      </Stack.Screen>
  
      {/* SignIn Screen */}
      <Stack.Screen name="SignIn">
        {(props) => <SignInScreen {...props} onSignIn={handleSignIn} />}
      </Stack.Screen>
  
      {/* SignUp Screen */}
      <Stack.Screen name="SignUp">
        {(props) => (
          <SignUpScreen
            {...props}
            onSignUp={(username, email, password) =>
              handleSignUp(username, email, password, props.navigation)
            }
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
  
};

export default AuthStack;
