import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

//import
import {theme} from '../utils/theme';
import { colors } from '../utils/colors';
import ScreenTitle from '../components/ScreenTitle';
import UserProfileIcon from '../components/UserProfileIcon';
import { strings } from '../utils/strings';

const { width, height } = Dimensions.get('window');

const SitterDetailsScreen = ({ route, navigation }) => {
  const { sitter, serviceRequest } = route.params;

    console.log(sitter);

  // Extract specific service's hourly rate
  const serviceRate = sitter.services[serviceRequest.serviceType]?.hourlyRate;

  console.log(serviceRequest);

  const handleConfirmSitter = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      // Create a new chat with the sitter
      const response = await axios.post(
        `${strings.baseURL}/messages/chats`,
        {
          userId2: sitter._id,
          serviceDetails: serviceRequest,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const chat = response.data;

      // Navigate to the chat screen
      navigation.navigate('Messages', {
        screen: 'Chat',
        params: { chatId: chat._id, otherUserName: sitter.username, otherUserId: sitter._id },
      });
    } catch (error) {
      console.error('Error confirming sitter:', error);
      Alert.alert('Error', 'Failed to confirm sitter.');
    }
  };

  return (
    <View style={styles.container}>
      <ScreenTitle title="Sitter Details"  showBackArrow={true} onBackPress={() => navigation.goBack()}/>

      <View style={styles.contentContainer}>
        {/* User Info */}
        <View style={styles.userContainer}>
          <UserProfileIcon />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{sitter.username}</Text>
          </View>
        </View>

        {/* Service Rate */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Hourly Rate</Text>
          <Text style={styles.infoText}>€{serviceRate}/hr</Text>
        </View>

        {/* Experience */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Experience</Text>
          <Text style={styles.infoText}>
            {sitter.petSittingExperience ? sitter.petSittingExperience : 'No experience information available'}
          </Text>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmSitter}>
          <Text style={styles.buttonText}>Confirm Sitter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  contentContainer: {
    flex: 1,
    padding: width * 0.05,
    paddingBottom: height * 0.12, // Ensure there's space above the button
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: width * 0.05,
    borderRadius: 10,
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  userInfo: {
    marginLeft: width * 0.05,
  },
  username: {
    fontSize: 20,
    fontFamily:theme.fonts.bold,
    color: colors.tomato,
  },
  infoBox: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: width * 0.05,
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  infoTitle: {
    fontSize: 18,
    color: colors.tomato,
    marginBottom: height * 0.01,
    fontFamily:theme.fonts.medium
  },
  infoText: {
    fontSize: 16,
    color: colors.black,
    fontFamily:theme.fonts.regular
  },
  confirmButton: {
    position: 'absolute', // Position the button at the bottom
    bottom: height * 0.03,
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: colors.tomato,
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily:theme.fonts.medium
  },
});


export default SitterDetailsScreen;
