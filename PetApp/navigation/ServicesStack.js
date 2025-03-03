import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importing screens
import ServicesScreen from '../screens/ServicesScreen';
import ServicesScreen2 from '../screens/ServicesScreen2';
import ServicesScreen3 from '../screens/ServicesScreen3';
import CreatePetScreen from '../screens/CreatePetScreen';
import AvailableSittersScreen from '../screens/AvailableSittersScreen';
import SitterDetailsScreen from '../screens/SitterDetailsScreen';

const Stack = createStackNavigator();

const ServicesStack = () => {

 const handleService = (navigation, title) => {
    // Pass the service title as a param to ServicesScreen2
    navigation.navigate('ServicesScreen2', { title });
  };

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ServicesMain">
          {(props) => (
            <ServicesScreen
              {...props}
              handleService={(title) => handleService(props.navigation, title)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ServicesScreen2" component={ServicesScreen2} />
        <Stack.Screen name="ServicesScreen3" component={ServicesScreen3} />
        <Stack.Screen name="CreatePetScreen" component={CreatePetScreen} />
        <Stack.Screen name="AvailableSittersScreen" component={AvailableSittersScreen} />
        <Stack.Screen name="SitterDetailsScreen" component={SitterDetailsScreen} />

      </Stack.Navigator>
    </>
  );
};

export default ServicesStack;
