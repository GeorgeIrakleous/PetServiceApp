import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//imports
import ProfileScreen from '../screens/ProfileScreen';
import BecomeSitterScreen from '../screens/BecomeSitterScreen';
import ReviewScreen from '../screens/ReviewScreen';
import WriteReviewScreen from '../screens/WriteReviewScreen';
import {strings} from '../utils/strings';

const Stack = createStackNavigator();

const ProfileStack = ({ onSignOut }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('Async token:',token);
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

    fetchUserData();
  }, []);

  // Show loading or error screen if necessary
 

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain">
        {(props) => <ProfileScreen {...props} onSignOut={onSignOut} userData={userData} setUserData={setUserData}/>}
      </Stack.Screen>
  
      <Stack.Screen name="BecomeSitterScreen">
        {(props) => <BecomeSitterScreen {...props} />}
      </Stack.Screen>

      <Stack.Screen name="Review">
        {(props) => <ReviewScreen {...props} />}
      </Stack.Screen>

      <Stack.Screen name="WriteReview">
        {(props) => <WriteReviewScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
  
};

export default ProfileStack;
