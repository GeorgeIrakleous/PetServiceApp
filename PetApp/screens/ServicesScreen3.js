import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Example library for calendar, customize if needed
import MapView, { Marker } from 'react-native-maps'; // Example library for map, customize if needed
import * as Location from 'expo-location'; // For location permissions and current location
import AsyncStorage from '@react-native-async-storage/async-storage'; // For retrieving the token
import axios from 'axios';  // Import axios for API calls

//importing
import { colors } from '../utils/colors';
import ScreenTitle from '../components/ScreenTitle'; // Assuming you have a ScreenTitle component
import {theme} from '../utils/theme';
import { strings } from '../utils/strings';

const { width, height } = Dimensions.get('window');

const ServicesScreen3 = ({route,navigation}) => {
  const { selectedPets, title } = route.params || {};

  const [markedDates, setMarkedDates] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude }); // Update marker state
  };

  let mapRegion = location ? location : {
    latitude: 37.78825, // Default region if location isn't available yet
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleSearchForSitterPress=()=>{
    if (!selectedDates.length) {
      Alert.alert('Select a Date', 'Please choose at least one date before proceeding.');
      return;
    }else{
      const loc={
        lat:location.latitude,
        lng:location.longitude
      }
      navigation.navigate('AvailableSittersScreen',{
        pets:selectedPets,
        serviceTyp:title,
        dates:selectedDates,
        location:loc
      });
    }
  }

  const handleRequestOffers=async()=>{
    if (!selectedDates.length) {
      Alert.alert('Select a Date', 'Please choose at least one date before proceeding.');
      return;
    }else{
      const loc={
        lat:location.latitude,
        lng:location.longitude
      }
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${strings.baseURL}/services/create-ad`,
        {
          pets:selectedPets,
          serviceType:title,
          dates:selectedDates,
          location:loc
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Ad Created', 'Your ad was created successfully! You will now start receiving offers for your request.');
      navigation.navigate('ServicesMain');
    }
  }

  const today = new Date().toISOString().split('T')[0];  // Get today's date in 'yyyy-mm-dd' format

  // Handle selecting multiple dates
  const onDayPress = (day) => {
    const date = day.dateString;

    if (selectedDates.includes(date)) {
      // Remove the date if it's already selected
      const newSelectedDates = selectedDates.filter(d => d !== date);
      setSelectedDates(newSelectedDates);
    } else {
      // Add the selected date
      setSelectedDates([...selectedDates, date]);
    }
  };

  useEffect(() => {
    const newMarkedDates = {};

    // Mark past dates as disabled and styled in light gray
    for (let i = 0; i < 365; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];
      newMarkedDates[formattedDate] = {
        disabled: true,
        disableTouchEvent: true,
        textColor: 'lightgray',
      };
    }

    // Mark selected dates in orange
    selectedDates.forEach(date => {
      newMarkedDates[date] = {
        selected: true,
        selectedColor: colors.tomato,  // Orange color for selected dates
      };
    });

    setMarkedDates(newMarkedDates);
  }, [selectedDates]);

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleContainer}>
        <ScreenTitle title="Select Date and Location" showBackArrow={true} onBackPress={() => navigation.goBack()}/>
      </View>

      {/* Calendar Container */}
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendar}
          minDate={today}  // Disable dates before today
          onDayPress={onDayPress}
          markedDates={markedDates}  // Use the markedDates for selected/past dates
          markingType={'multi-dot'}  // Enable multi-date selection
        />
      </View>
      
      {/* Map Container */}
      <View style={styles.mapContainer}>
        
        <MapView style={styles.map} region={mapRegion} onPress={handleMapPress}>
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
            />
          )}
        </MapView>
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.buttonLeft} onPress={handleSearchForSitterPress}>
          <Text style={styles.buttonText}>Search for Sitters</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonRight} onPress={handleRequestOffers}>
          <Text style={styles.buttonText}>Request Offers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
    paddingVertical: height * 0.0, // Add some padding to the top and bottom
  },
  titleContainer: {
    marginBottom: height * 0.0,
  },
  calendarContainer: {
    flex: 1,  // Takes 1/3 of the screen height
    borderRadius: 15,
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.05,
  },
  calendar: {
    borderRadius: 15,
  },
  mapContainer: {
    flex: 1,  // Takes 1/3 of the screen height
    backgroundColor: 'white',
    marginHorizontal: width * 0.05,
    borderRadius: 15,
    overflow: 'hidden', // Ensures rounded corners for the map
    marginBottom: height * 0.02, // Add some margin below to separate from the buttons
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.02, // Add padding to the bottom
  },
  buttonLeft: {
    flex: 1,
    backgroundColor: colors.tomato,
    paddingVertical: height * 0.02,  // Dynamic vertical padding based on screen height
    marginRight: width * 0.02,  // Dynamic margin between buttons based on screen width
    borderRadius: width * 0.03, // Dynamic border radius based on screen width
    alignItems: 'center',
  },
  buttonRight: {
    flex: 1,
    backgroundColor: colors.tomato,
    paddingVertical: height * 0.02,  // Dynamic vertical padding based on screen height
    marginLeft: width * 0.02,  // Dynamic margin between buttons based on screen width
    borderRadius: width * 0.03, // Dynamic border radius based on screen width
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: theme.fonts.medium
  },
});

export default ServicesScreen3;