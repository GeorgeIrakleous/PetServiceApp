import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome

//import
import {theme} from '../utils/theme';
import ScreenTitle from '../components/ScreenTitle';
import { colors } from '../utils/colors';
import SERVICE_TYPES from '../utils/serviceTypes';
import {strings} from '../utils/strings';

const { width, height } = Dimensions.get('window');

const BecomeSitterScreen = ({ navigation }) => {
  const [services, setServices] = useState(
    SERVICE_TYPES.reduce((acc, service) => {
      acc[service.name.toLowerCase().replace(/[\s-]/g, '')] = { selected: false, hourlyRate: '' };
      return acc;
    }, {})
  );

  const [experience, setExperience] = useState('');

  const handleServiceSelect = (serviceName, selected) => {
    setServices((prevServices) => ({
      ...prevServices,
      [serviceName]: { ...prevServices[serviceName], selected: selected || false }, // Fallback to false if not defined
    }));
  };

  const handleHourlyRateChange = (serviceName, rate) => {
    setServices((prevServices) => ({
      ...prevServices,
      [serviceName]: {
        ...prevServices[serviceName],
        hourlyRate: rate || '',  // Set an empty string as a fallback if not defined
      },
    }));
  };

  const handleBecomeSitter = async () => {
    console.log(services);

    const transformedServices = {
      petSitting: {
        available: services.petsitting?.selected || false,
        hourlyRate: services.petsitting?.hourlyRate || null, // Only include hourly rate if selected
      },
      training: {
        available: services.training?.selected || false,
        hourlyRate: services.training?.hourlyRate || null,
      },
      petGrooming: {
        available: services.petgrooming?.selected || false,
        hourlyRate: services.petgrooming?.hourlyRate || null,
      },
      petWalking: {
        available: services.petwalking?.selected || false,
        hourlyRate: services.petwalking?.hourlyRate || null,
      },
      petDropOff: {
        available: services.petdropoff?.selected || false,
        hourlyRate: services.petdropoff?.hourlyRate || null,
      },
    };

    console.log(transformedServices);

    // Check if at least one service is selected
    const selectedServices = Object.keys(transformedServices).filter(
      (service) => transformedServices[service].available && transformedServices[service].hourlyRate
    );

    if (selectedServices.length === 0) {
      Alert.alert('Error', 'Please select at least one service and provide the hourly rate.');
      return;
    }

    if (!experience) {
      Alert.alert('Error', 'Please provide your experience with pets.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');

      const response = await axios.put(
        `${strings.baseURL}/user/become-sitter`, // Call the correct API endpoint
        {
          services: transformedServices,
          petSittingExperience: experience, // Send the experience along with the selected services
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token for authorization
          },
        }
      );

      Alert.alert('Success', 'You are now a sitter!');
      navigation.goBack(); // Navigate back on success
    } catch (error) {
      console.error('Error becoming a sitter:', error);
      Alert.alert('Error', 'Failed to become a sitter. Please try again later.');
    }
  };

  return (
    <>
      <ScreenTitle title="Become a Sitter" showBackArrow={true} onBackPress={() => navigation.goBack()}/>
      
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Service Type Selection */}
          {SERVICE_TYPES.map((service) => {
            const serviceKey = service.name.toLowerCase().replace(/[\s-]/g, ''); // Normalize key
            return (
              <View key={service.id} style={styles.questionBox}>
                <View style={styles.serviceRow}>
                  {/* Icon for each service */}
                  <Text style={styles.label}>Can you offer {service.name} services?</Text>
                  <FontAwesome name={service.iconName} size={24} color={colors.tomato} style={styles.serviceIcon} />
                </View>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={[styles.optionButton, services[serviceKey]?.selected && styles.selectedButton]}
                    onPress={() => handleServiceSelect(serviceKey, true)}
                  >
                    <Text style={styles.buttonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.optionButton, !services[serviceKey]?.selected && styles.selectedButton]}
                    onPress={() => handleServiceSelect(serviceKey, false)}
                  >
                    <Text style={styles.buttonText}>No</Text>
                  </TouchableOpacity>
                </View>

                {/* Hourly Rate Input if the user selects Yes */}
                {services[serviceKey]?.selected && (
                  <View style={styles.hourlyRateContainer}>
                    <Text style={styles.label}>Hourly Rate</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={`Enter hourly rate for ${service.name} (in EUR)`}
                      keyboardType="numeric"
                      value={services[serviceKey]?.hourlyRate}
                      onChangeText={(rate) => handleHourlyRateChange(serviceKey, rate)}
                    />
                  </View>
                )}
              </View>
            );
          })}

          {/* Experience Input */}
          <View style={styles.questionBox}>
            <Text style={styles.label}>Experience</Text>
            <TextInput
              style={styles.inputDescription}
              placeholder="Tell us about your experience with pets."
              multiline
              value={experience}
              onChangeText={setExperience}
            />
          </View>

          {/* Become a Sitter Button inside the scrollable form */}
          <TouchableOpacity style={styles.createButton} onPress={handleBecomeSitter}>
            <Text style={styles.createButtonText}>Become a Sitter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between', 
    paddingBottom: height * 0.02,
  },
  formContainer: {
    paddingHorizontal: width * 0.05,
  },
  questionBox: {
    backgroundColor: 'white',
    padding: width * 0.05,
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: height * 0.01,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    marginRight: width * 0.0,
    marginLeft: width* 0.02,
    marginBottom: height*0.01,
  },
  label: {
    fontSize: width * 0.043,
    marginBottom: height * 0.01,
    color: 'black',
    fontFamily:theme.fonts.regular
  },
  input: {
    width: '100%',
    padding: width * 0.025,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  inputDescription: {
    width: '100%',
    padding: width * 0.025,
    paddingVertical: height * 0.05,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.05,
    backgroundColor: 'white',
    fontFamily:theme.fonts.regular
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingVertical: height * 0.02,
    marginHorizontal: width * 0.01,
    borderRadius: width * 0.02,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: colors.tomato,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontFamily:theme.fonts.medium
  },
  hourlyRateContainer: {
    marginTop: height * 0.01,
  },
  createButton: {
    backgroundColor: colors.tomato,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    marginTop: height * 0.03,
    borderRadius: width * 0.02,
  },
  createButtonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontFamily:theme.fonts.medium
  },
});

export default BecomeSitterScreen;
