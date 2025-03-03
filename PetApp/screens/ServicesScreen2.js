import React, { useState, useEffect ,useCallback} from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For retrieving the token
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome for the bin icon
import { useFocusEffect } from '@react-navigation/native';

// Import components
import ScreenTitle from '../components/ScreenTitle';
import PetItem from '../components/PetItem';
import { colors } from '../utils/colors';
import {theme} from '../utils/theme';
import { strings } from '../utils/strings';

const { width, height } = Dimensions.get('window');

const ServicesScreen2 = ({ route, navigation }) => {
  const { title } = route.params; // Extract the title from route.params
  const [pets, setPets] = useState([]); // State to store the list of pets
  const [selectedPets, setSelectedPets] = useState(new Set()); // State to manage selected pets

  const handleNextPress=()=>{
    if(selectedPets.size>0){
      navigation.navigate('ServicesScreen3', {
        selectedPets: Array.from(selectedPets), // Convert Set to Array before passing
        title, // Pass the title directly
      })
    }else{
      Alert.alert('No Pets Selected', 'Please select at least one pet to continue.');
    }
  }

  const fetchPets = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${strings.baseURL}/services/pets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Set the pets in the state
      setPets(response.data.pets);
    } catch (error) {
      console.error('Error fetching pets:', error);
      Alert.alert('Error', 'Failed to fetch pets. Please try again later.');
    }
  };

  // Refetch pets every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [])
  );

  // Toggle selection for pets
  const handlePetSelect = (petId) => {
    const updatedSelection = new Set(selectedPets);
    if (updatedSelection.has(petId)) {
      updatedSelection.delete(petId);
    } else {
      updatedSelection.add(petId);
    }
    setSelectedPets(updatedSelection);
  };

  // Handle deletion of selected pets
  const handleDeletePets = async () => {
    if (selectedPets.size === 0) {
      Alert.alert('No Pets Selected', 'Please select at least one pet to delete.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.delete(`${strings.baseURL}/services/delete-pets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { petIds: Array.from(selectedPets) }, // Send the selected pet IDs in the request body
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Selected pets deleted successfully.');
        // Refresh the list after deletion
        setPets((prevPets) => prevPets.filter((pet) => !selectedPets.has(pet._id)));
        setSelectedPets(new Set()); // Clear the selection
      }
    } catch (error) {
      console.error('Error deleting pets:', error);
      Alert.alert('Error', 'Failed to delete pets. Please try again later.');
    }
  };

  return (
    <View style={styles.root}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <ScreenTitle title="Select Your Pets" showBackArrow={true} onBackPress={() => navigation.goBack()}/>
      </View>

      <View style={styles.buttonsStyle}>
        {/* Add New Pet Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreatePetScreen')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        {/* Delete Pets Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeletePets}
        >
          <FontAwesome name="trash" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Section */}
      <View style={styles.scrollableContainer}>
        <ScrollView style={{ marginBottom: height * 0.02 }}>
          {pets.map((pet) => (
              <PetItem
              key={pet._id}
              pet={pet}
              isSelected={selectedPets.has(pet._id)}
              onSelect={handlePetSelect}
            />
          ))}
        </ScrollView>
      </View>

      {/* Next Button */}
      <View style={styles.nextButtonContainer}>
        <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNextPress}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.lightGrey, // This ensures consistent background across the entire screen
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightGrey,
  },
  scrollableContainer: {
    flex: 1,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  petItem: {
    backgroundColor: 'white',
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.1,
    borderRadius: 10,
    marginBottom: height * 0.02,
    borderColor: colors.darkerGrey,
    borderWidth: 2,
  },
  selectedPetItem: {
    borderColor: colors.tomato,
  },
  petItemText: {
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.tomato,
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.02,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: colors.tomato,
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.02,
  },
  nextButton: {
    backgroundColor: colors.tomato,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: 10,
  },
  buttonsStyle: {
    backgroundColor:colors.lightGrey,
    flexDirection:'row',
    marginVertical:height*0.0,
    marginBottom: height*0.02,
    marginRight:width*0.05,
    justifyContent:'flex-end',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily:theme.fonts.medium
  },
});

export default ServicesScreen2;
