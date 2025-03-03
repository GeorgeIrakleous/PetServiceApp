import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Import screens
import JobsScreen from '../screens/JobsScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import {strings} from '../utils/strings';

const Stack = createStackNavigator();

const JobsStack = () => {
  const [userData, setUserData] = useState(null);

  //console.log('userData:',userData);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const response = await axios.get(`${strings.baseURL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobsMain">
        {(props) => (
          <JobsScreen {...props} userData={userData} refreshUserData={fetchUserData} />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
        options={{ title: 'Job Details' }} // Optional header title
      />
    </Stack.Navigator>
  );
};

export default JobsStack;
