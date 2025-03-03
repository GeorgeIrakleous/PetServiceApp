import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, TextInput, View, Text, StyleSheet, ScrollView, Dimensions, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ScreenTitle from '../components/ScreenTitle';
import FilterButton from '../components/FilterButton';
import SitterCard from '../components/SitterCard';
import { colors } from '../utils/colors';
import {strings} from '../utils/strings';

const { width, height } = Dimensions.get('window');

const serviceTypeDisplayMapping = {
  'petSitting': 'Pet Sitting',
  'training': 'Training',
  'petGrooming': 'Grooming',
  'petWalking': 'Pet Walking',
  'petDropOff': 'Pet Drop-off',
};

const formatServiceType = (type) => serviceTypeDisplayMapping[type] || type;

const AvailableSittersScreen = ({ route, navigation }) => {
  const { serviceTyp, pets, dates, location } = route.params;
  const serviceType = serviceTyp.charAt(0).toLowerCase() + serviceTyp.slice(1).replace(/[\s-]/g, '');
  const formattedServiceType = formatServiceType(serviceType);

  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState('');
  const [selectedHourlyRate, setSelectedHourlyRate] = useState(''); // New state for hourly rate filter

  useEffect(() => {
    fetchSitters();
  }, [serviceType]);

  const fetchSitters = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${strings.baseURL}/services/sitters2`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { serviceType, radius: selectedRadius || undefined },
      });
      setSitters(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sitters:', error);
      Alert.alert('Error', 'Failed to load sitters.');
      setLoading(false);
    }
  };

  const handleSelectSitter = (sitter) => {
    navigation.navigate('SitterDetailsScreen', {
      sitter,
      serviceRequest: { pets, serviceType, dates, location },
    });
  };

  const handleApplyFilters = () => {
    setModalVisible(false);
    fetchSitters();
  };

  const handleClearFilters = () => {
    setSelectedRadius('');
    setSelectedHourlyRate(''); // Reset hourly rate filter
    setModalVisible(false);
    fetchSitters();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={36} color={colors.tomato} />
      </View>
    );
  }

  return (
    <>
      <ScreenTitle title={`Select a Sitter`} showBackArrow={true} onBackPress={() => navigation.goBack()} />

      <View style={styles.filtersContainer}>
        <FilterButton onPress={() => setModalVisible(true)} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {sitters.length === 0 ? (
          <View style={styles.centeredContainer}>
            <Text>No sitters available for {serviceType}.</Text>
          </View>
        ) : (
          sitters.map((sitter) => (
            <SitterCard
              key={sitter._id}
              sitter={sitter}
              serviceType={serviceType}
              formattedServiceType={formattedServiceType}
              onSelect={handleSelectSitter}
            />
          ))
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Filter Options</Text>

          {/* Filters */}
          <View style={styles.filters}>
            {/* Radius Filter */}
            <Text style={styles.label}>Radius (km)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter radius"
              value={selectedRadius}
              onChangeText={setSelectedRadius}
            />

            {/* Hourly Rate Filter */}
            <Text style={styles.label}>Hourly Rate (€)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter max hourly rate"
              value={selectedHourlyRate}
              onChangeText={setSelectedHourlyRate}
            />
          </View>

          {/* Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingBottom: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.2,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'space-between', // Align elements properly
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.tomato,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  filters: {
    flex: 1,
    justifyContent: 'center', // Center filters
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginVertical: 10,
    marginLeft:width*0.1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  modalButtons: {
    marginBottom: 20, // Ensure buttons are at the bottom
  },
  applyButton: {
    backgroundColor: colors.tomato,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  clearButton: {
    backgroundColor: colors.grey,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  applyButtonText: {
    color: 'white',
  },
  clearButtonText: {
    color: 'black',
  },
  filtersContainer: {
    marginTop: height * 0.012,
    marginLeft: width * 0.08,
    marginBottom: height * 0.03,
  },
});

export default AvailableSittersScreen;
