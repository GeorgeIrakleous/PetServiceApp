import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Modal, TextInput, Button, TouchableOpacity, Image, StyleSheet, View, Dimensions, ScrollView, ActivityIndicator, Text, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import
import ScreenTitle from '../components/ScreenTitle';
import JobItem from '../components/JobItem';
import { colors } from '../utils/colors';
import FilterButton from '../components/FilterButton';
import {theme} from '../utils/theme';
import { strings } from '../utils/strings';

const { width, height } = Dimensions.get('window');

const JobsScreen = ({ navigation , userData,refreshUserData}) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filters state
  const [selectedServiceTypes, setSelectedServiceTypes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [radius, setRadius] = useState('');

  const serviceTypes = ['Pet Sitting', 'Training', 'Pet Grooming', 'Pet Walking', 'Pet Drop-off', 'Pet Daycare'];

  const fetchAds = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${strings.baseURL}/jobs/ads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          serviceTypes: selectedServiceTypes.length > 0 ? selectedServiceTypes.join(',') : undefined,
          date: selectedDate || undefined,
          radius: radius || undefined,
        },
      });
      setAds(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ads:', error);
      Alert.alert('Error', 'Failed to load jobs.');
      setLoading(false);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      //console.log("JobScreen useEffect worked.");
      refreshUserData();
      fetchAds();
    }, [selectedServiceTypes, selectedDate, radius])
  );

  const handleServiceTypeSelect = (type) => {
    if (selectedServiceTypes.includes(type)) {
      setSelectedServiceTypes(selectedServiceTypes.filter(item => item !== type));
    } else {
      setSelectedServiceTypes([...selectedServiceTypes, type]);
    }
  };

  const handleViewJobDetails = (job) => {
    navigation.navigate('JobDetails', { job }); // Navigate to JobDetailsScreen with job data
  };
  

  const handleApplyFilters = () => {
    setModalVisible(false);
    fetchAds();
  };

  const handleClearFilters = () => {
    setSelectedServiceTypes([]);
    setSelectedDate('');
    setRadius('');
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={36} color={colors.tomato} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const handleSelectJob = async (ad) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const clientId = ad.userId;
      const clientUsername = ad.userId.username;
      const adId = ad._id;

      const response = await axios.post(
        `${strings.baseURL}/messages/chats`,
        { userId2: clientId, adId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const chat = response.data;

      navigation.navigate('Messages', {
        screen: 'Chat',
        params: { chatId: chat._id, otherUserName: clientUsername, otherUserId: clientId },
      });

    } catch (error) {
      console.error('Error creating chat:', error);
      Alert.alert('Error', 'Failed to create chat.');
    }
  };

  return (
    <View style={styles.screenContainer}>
      {userData?.sitter ? (
        // Content for sitters   
        <>
          <View style={styles.container}>
            <ScreenTitle title="Select a Job" />
          </View>
          <View style={styles.filtersContainer}>
            <FilterButton onPress={() => setModalVisible(true)} />
          </View>
  
          <View style={styles.scrollableContainer}>
            <ScrollView style={{ marginVertical: height * 0.01 }}>
              {ads.length > 0 ? (
                ads.map((ad) => (
                  <JobItem
                    key={ad._id}
                    title={ad.serviceType}
                    user={ad.userId.username}
                    dates={ad.dates}
                    pets={ad.pets}
                    onPress={() => handleViewJobDetails(ad)}
                  />
                ))
              ) : (
                <Text>No jobs found.</Text>
              )}
            </ScrollView>
          </View>
  
          <View style={styles.imageContainer}>
            <Image source={require('../assets/myImages/petsImage6.jpg')} style={styles.image} />
          </View>
        </>
      ) : (
        // Message for non-sitters
        <View style={styles.centeredMessageContainer}>
          <View style={styles.image2Container}>
            <Image source={require('../assets/myImages/catWithCash.jpg')} style={styles.image2} />
          </View>
          <Text style={styles.centeredMessageText}>
            You need to be a sitter to view this page. You can become a sitter in the profile page.
          </Text>
        </View>
      )}
  
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
  
          <Text style={styles.modalTitle}>Filter Options</Text>
  
          <Text style={styles.label}>Selected Service Types:</Text>
  
          <View style={styles.centeredOptions}>
            {serviceTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.option, selectedServiceTypes.includes(type) ? styles.selectedOption : null]}
                onPress={() => handleServiceTypeSelect(type)}
              >
                <Text style={selectedServiceTypes.includes(type) ? styles.selectedOptionText : styles.optionText}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
  
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={selectedDate}
            onChangeText={setSelectedDate}
          />
  
          <Text style={styles.label}>Radius (km)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter radius"
            value={radius}
            onChangeText={(text) => setRadius(text)}
          />
  
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
  
};

const styles = StyleSheet.create({
  screenContainer:{
    flex:1,
    backgroundColor:colors.lightGrey
  },
  container: {
    backgroundColor: colors.lightGrey,
  },
  scrollableContainer: {
    flex: 1,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
  },
  filtersContainer: {
    flex: 1 / 8,
    backgroundColor: colors.lightGrey,
    justifyContent: 'center',
    marginLeft: width * 0.08,
  },
  imageContainer: {
    flex: 1 / 4.8,
    backgroundColor: colors.lightGrey,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: '',
  },
  Container: {
    flex: 1 / 4.8,
    backgroundColor: colors.black,
  },
  image2: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  image2Container: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2, // Makes it circular
    overflow: 'hidden',
    marginBottom: height * 0.02, // Space between image and text
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Optional: background for image container
    borderWidth: width * 0.005, // Border width for the circle
    borderColor: colors.darkerGrey, // Border color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },modalContainer: {
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    cimage2olor: colors.tomato,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  selectedFiltersText: {
    fontSize: 16,
    color: colors.darkGrey,
    marginBottom: 20,
    textAlign: 'center',
  },
  centeredOptions: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  option: {
    backgroundColor: colors.lightGrey,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: colors.tomato,
  },
  optionText: {
    fontSize: 16,
    color: colors.black,
  },
  selectedOptionText: {
    fontSize: 16,
    color: colors.white,
  },
  applyButton: {
    backgroundColor: colors.tomato,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '80%',
  },
  clearButton: {
    backgroundColor: colors.grey,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  applyButtonText: {
    color: 'white',
  },
  clearButtonText: {
    color: 'black',
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
    backgroundColor:colors.lightGrey,
    marginBottom:height*0.15
  },
  centeredMessageText: {
    fontSize: 24,
    textAlign: 'center',
    color: colors.darkerGrey,
    fontFamily: theme.fonts.medium
  },
  
});

export default JobsScreen;
