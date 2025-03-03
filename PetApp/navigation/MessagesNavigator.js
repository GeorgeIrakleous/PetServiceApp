import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//import
import MessagesScreen from '../screens/MessagesScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

const MessagesNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
          <Stack.Screen name="MessageUsers" component={MessagesScreen}/>
          <Stack.Screen name="Chat" component={ChatScreen}/>
        </Stack.Navigator>
    );
};

export default MessagesNavigator;