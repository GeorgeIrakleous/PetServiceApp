import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import screens and stacks
import ServicesStack from './ServicesStack';
import JobsStack from './JobsStack';
import ProfileStack from './ProfileStack';
import TopLogoBar from '../components/TopLogoBar';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation,onSignOut:onSignOut }) => {

  const handleMessagesButtonPress = () => {
    navigation.navigate('Messages');
  }

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={{ flex: 1 }}>
        <TopLogoBar onPress={handleMessagesButtonPress} />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Profile') {
                iconName = 'user';
              } else if (route.name === 'Jobs') {
                iconName = 'money';
              } else if (route.name === 'Services') {
                iconName = 'search';
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { display: 'flex' },
            tabBarLabelStyle: {
              fontSize: 14, // Increase the font size
              fontWeight: '600', // Make the text bold for better readability
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Services" component={ServicesStack} />
          <Tab.Screen name="Jobs" component={JobsStack} />
          <Tab.Screen name="Profile">
            {(props) => <ProfileStack {...props} onSignOut={onSignOut} />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default TabNavigator;
