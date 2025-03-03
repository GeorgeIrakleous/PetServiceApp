import React from 'react';
import { Image,View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity,Alert } from 'react-native';
import { Calendar } from 'react-native-calendars'; 
import MapView, { Marker } from 'react-native-maps'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

//import
import {theme} from '../utils/theme';
import { colors } from '../utils/colors';
import ScreenTitle from '../components/ScreenTitle';
import UserProfileIcon from '../components/UserProfileIcon'; // Import UserProfileIcon component
import { strings } from '../utils/strings';

const { width, height } = Dimensions.get('window');

const JobDetailsScreen = ({ route, navigation }) => {
  const { job } = route.params;

  console.log("job:",job);
  const handleSelectJob = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const clientId = job.userId;
      const adId = job._id;
  
      const response = await axios.post(
        `${strings.baseURL}/messages/chats`,
        { userId2: clientId, adId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Check the response to handle success or failure
      if (response.data.success === false) {
        // Show an alert if the sitter does not provide the required service
        Alert.alert(
          'Job Selection',
          response.data.message || 'You do not meet the requirements for this job.',
          [{ text: 'OK' }]
        );
        return; // Prevent navigation if not successful
      }
  
      // Navigate to the chat if successful
      const chat = response.data;
      navigation.navigate('Messages', {
        screen: 'Chat',
        params: { chatId: chat._id, otherUserName: job.userId.username, otherUserId: clientId },
      });
    } catch (error) {
      console.error('Error creating chat:', error);
      Alert.alert('Error', 'Failed to create chat. Please try again later.');
    }
  };
  

  const markedDates = job.dates.reduce((acc, date) => {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    acc[formattedDate] = { selected: true, textColor: colors.tomato, selectedColor: colors.tomato };
    return acc;
  }, {});

  const initialDate = job.dates.length > 0 ? job.dates[0] : new Date().toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      <ScreenTitle title="Job Details" showBackArrow={true} onBackPress={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User */}
        <View style={styles.userContainer}>
          <UserProfileIcon userId={job.userId._id} size={60} />
          <View style={styles.userInfo}>
            <Text style={styles.infoTitle}>User</Text>
            <Text style={styles.infoText}>{job.userId.username}</Text>
          </View>
        </View>

        {/* Service Type */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Service Type</Text>
          <Text style={styles.infoText}>{job.serviceType}</Text>
        </View>

        {/* Pets */}   
        <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Pets</Text>
            {job.pets.length > 0 ? (
                job.pets.map((pet, index) => (
                <View key={pet._id} style={styles.petBox}>
                    {/* Pet Icon */}
                    <Image
                    source={
                        pet.typeOfPet === 'Dog'
                        ? require('../assets/myImages/dog_icon.png')
                        : require('../assets/myImages/cat_icon.png')
                    }
                    style={styles.petIcon}
                    />

                    {/* Pet Details */}
                    <Text style={styles.petInfoText}>
                    <Text style={styles.petLabel}>Name: </Text>
                    <Text>{pet.name || 'N/A'}</Text>
                    </Text>
                    <Text style={styles.petInfoText}>
                    <Text style={styles.petLabel}>Type: </Text>
                    <Text>{pet.typeOfPet || 'N/A'}</Text>
                    </Text>
                    <Text style={styles.petInfoText}>
                    <Text style={styles.petLabel}>Age: </Text>
                    <Text>{pet.age || 'N/A'}</Text>
                    </Text>
                    <Text style={styles.petInfoText}>
                    <Text style={styles.petLabel}>Breed: </Text>
                    <Text>{pet.breed || 'N/A'}</Text>
                    </Text>
                    <Text style={styles.petInfoText}>
                    <Text style={styles.petLabel}>Size: </Text>
                    <Text>{pet.petSize || 'N/A'}</Text>
                    </Text>
                    <Text style={styles.petInfoText}>
                    <Text style={styles.petLabel}>Gets Along with Dogs: </Text>
                    <Text>{pet.getsAlongWithDogs || 'N/A'}</Text>
                    </Text>
                    <Text style={styles.petInfoText}>
                    <Text style={styles.petLabel}>Gets Along with Cats: </Text>
                    <Text>{pet.getsAlongWithCats || 'N/A'}</Text>
                    </Text>

                    {/* Separator between pets */}
                    {index < job.pets.length - 1 && <View style={styles.separator} />}
                </View>
                ))
            ) : (
                <Text style={styles.infoText}>No pets listed</Text>
            )}
        </View>




        {/* Dates */}
        <View style={styles.infoBox}>
          <Calendar
            style={styles.calendar}
            markingType={'multi-dot'}
            markedDates={markedDates}
            current={initialDate}
            disableAllTouchEventsForDisabledDays={true}
          />
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: job.location.lat,
              longitude: job.location.lng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{
                latitude: job.location.lat,
                longitude: job.location.lng,
              }}
              title="Job Location"
            />
          </MapView>
        </View>

        {/* Select Button */}
        <TouchableOpacity style={styles.selectButton} onPress={handleSelectJob}>
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  scrollContent: {
    padding: width * 0.05,
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
    fontWeight: 'bold',
    color: colors.tomato,
    marginBottom: height * 0.01,
  },
  infoText: {
    fontSize: 16,
    color: colors.black,
    fontFamily:theme.fonts.regular
  },
  petDetails: {
    marginBottom: height * 0.01,
  },
  petInfoText: {
    fontSize: 16,
    color: colors.black,
  },
  petLabel: {
    fontWeight: 'bold',
    color: colors.tomato,
  },
  calendar: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  mapContainer: {
    height: height * 0.3,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: height * 0.02,
  },
  map: {
    flex: 1,
  },
  selectButton: {
    backgroundColor: colors.tomato,
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily:theme.fonts.medium
  },
  petBox: {
    marginBottom: height * 0.02,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'relative', // Required for absolute positioning within this container
  },
  separator: {
    height: 1,
    backgroundColor: colors.grey,
    marginTop: height * 0.02,
  },
  infoTitle: {
    fontSize: 20, // Larger font size for main title
    color: colors.tomato,
    marginBottom: height * 0.02,
    fontFamily:theme.fonts.medium
  },
  petLabel: {
    color: colors.tomato, // Tomato color for pet field labels
    fontFamily:theme.fonts.regular
  },
  petInfoText: {
    fontSize: 16, // Adjusted size for pet info
    color: colors.black,
    marginBottom: height * 0.01, // Space between fields
    fontFamily:theme.fonts.regular
  },
  petIcon: {
    width: width * 0.15, // Adjust size as needed
    height: width * 0.15,
    position: 'absolute',
    top: height * 0.02, // Adjust vertical positioning
    right: width * 0.04, // Adjust horizontal positioning
    resizeMode: 'contain',
  },
  
});

export default JobDetailsScreen;
