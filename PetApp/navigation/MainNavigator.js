import React from 'react';
import { View } from 'react-native';

//import
import TabNavigator from './TabNavigator';
import MessagesNavigator from './MessagesNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import MessagesScreen from '../screens/MessagesScreen';

const Stack = createStackNavigator();

const MainNavigator = ({onSignIn:onSignOut}) => {
  return (
    <View style={{flex:1, backgroundColor:'blue'}}>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Tabs">
          {(props) => <TabNavigator {...props} onSignOut={onSignOut} />}
        </Stack.Screen>
        <Stack.Screen name="Messages" component={MessagesNavigator}/>
      </Stack.Navigator>
    </View>
  );
};



export default MainNavigator;
