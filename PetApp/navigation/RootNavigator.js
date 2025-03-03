import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native'; // Import Button and View components
import AuthStack from './AuthStack';
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="MainNavigator">
              {(props) => <MainNavigator {...props} onSignIn={() => setIsAuthenticated(false)} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Auth">
              {(props) => <AuthStack {...props} onSignIn={() => setIsAuthenticated(true)} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
        
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  // Add any styles needed for the button or container
});

export default RootNavigator;
