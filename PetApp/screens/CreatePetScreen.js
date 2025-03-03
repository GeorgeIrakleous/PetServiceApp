import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';  // Import axios for API calls
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage to get the JWT token

//import
import {theme} from '../utils/theme';
import ScreenTitle from '../components/ScreenTitle';
import { colors } from '../utils/colors';
import { strings } from '../utils/strings';

const { width, height } = Dimensions.get('window');

const CreatePetScreen = ({ navigation }) => {
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('Dog');
  const [petSize, setPetSize] = useState('1-5 kg');
  const [petAge, setPetAge] = useState('Puppy');
  const [petBreed, setPetBreed] = useState('');
  const [petGetsAlongWithDogs, setPetGetsAlongWithDogs] = useState('Yes');
  const [petGetsAlongWithCats, setPetGetsAlongWithCats] = useState('Yes');

  const handlePetTypeSelect = (type) => setPetType(type);
  const handlePetSizeSelect = (size) => setPetSize(size);
  const handlePetAgeSelect = (age) => setPetAge(age);
  const handleGetsAlongWithDogsSelect = (option) => setPetGetsAlongWithDogs(option);
  const handleGetsAlongWithCatsSelect = (option) => setPetGetsAlongWithCats(option);

  const handleCreatePet = async () => {
    if (!petName || !petType || !petSize || !petAge || !petBreed || !petGetsAlongWithDogs || !petGetsAlongWithCats) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${strings.baseURL}/services/add-pet`,
        {
          petData: {
            name: petName,
            typeOfPet: petType,
            petSize: petSize, 
            age: petAge,
            breed: petBreed,
            getsAlongWithDogs: petGetsAlongWithDogs,
            getsAlongWithCats: petGetsAlongWithCats,
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Success', 'Pet added successfully!');
      navigation.goBack();  // Navigate back to the previous screen after successful creation
    } catch (error) {
      console.error('Error creating pet:', error);
      Alert.alert('Error', 'Failed to add pet. Please try again later.');
    }
  };

  return (
    <>
      <ScreenTitle title="Create a Pet" showBackArrow={true} onBackPress={() => navigation.goBack()}/>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.formContainer}>
            {/* Pet Name Input */}
            <Text style={styles.label}>Pet Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your pet's name"
              value={petName}
              onChangeText={setPetName}
            />

            {/* Pet Type Selection */}
            <Text style={styles.label}>Pet Type</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.optionButton, petType === 'Dog' && styles.selectedButton]}
                onPress={() => handlePetTypeSelect('Dog')}
              >
                <Text style={styles.buttonText}>Dog</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, petType === 'Cat' && styles.selectedButton]}
                onPress={() => handlePetTypeSelect('Cat')}
              >
                <Text style={styles.buttonText}>Cat</Text>
              </TouchableOpacity>
            </View>

            {/* Pet Size Selection */}
            <Text style={styles.label}>Pet Size</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.optionButton, petSize === '1-5 kg' && styles.selectedButton]}
                onPress={() => handlePetSizeSelect('1-5 kg')}
              >
                <Text style={styles.buttonText}>1-5 kg</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, petSize === '6-15 kg' && styles.selectedButton]}
                onPress={() => handlePetSizeSelect('6-15 kg')}
              >
                <Text style={styles.buttonText}>6-15 kg</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, petSize === '16-30 kg' && styles.selectedButton]}
                onPress={() => handlePetSizeSelect('16-30 kg')}
              >
                <Text style={styles.buttonText}>16-30 kg</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, petSize === '31+ kg' && styles.selectedButton]}
                onPress={() => handlePetSizeSelect('31+ kg')}
              >
                <Text style={styles.buttonText}>31+ kg</Text>
              </TouchableOpacity>
            </View>

            {/* Pet Age Selection */}
            <Text style={styles.label}>Pet Age</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.optionButton, petAge === 'Puppy' && styles.selectedButton]}
                onPress={() => handlePetAgeSelect('Puppy')}
              >
                <Text style={styles.buttonText}>Puppy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, petAge === 'Adult' && styles.selectedButton]}
                onPress={() => handlePetAgeSelect('Adult')}
              >
                <Text style={styles.buttonText}>Adult</Text>
              </TouchableOpacity>
            </View>

            {/* Pet Breed Input */}
            <Text style={styles.label}>Pet Breed</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter breed"
              value={petBreed}
              onChangeText={setPetBreed}
            />

            {/* Gets Along with Dogs */}
            <Text style={styles.label}>Gets Along With Dogs</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.optionButton, petGetsAlongWithDogs === 'Yes' && styles.selectedButton]}
              onPress={() => handleGetsAlongWithDogsSelect('Yes')}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, petGetsAlongWithDogs === 'No' && styles.selectedButton]}
              onPress={() => handleGetsAlongWithDogsSelect('No')}
            >
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, petGetsAlongWithDogs === 'Unsure' && styles.selectedButton]}
              onPress={() => handleGetsAlongWithDogsSelect('Unsure')}
            >
              <Text style={styles.buttonText}>Unsure</Text>
            </TouchableOpacity>
          </View>

            {/* Gets Along with Cats */}
            <Text style={styles.label}>Gets Along with Cats</Text>
            <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.optionButton, petGetsAlongWithCats === 'Yes' && styles.selectedButton]}
              onPress={() => handleGetsAlongWithCatsSelect('Yes')}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, petGetsAlongWithCats === 'No' && styles.selectedButton]}
              onPress={() => handleGetsAlongWithCatsSelect('No')}
            >
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, petGetsAlongWithCats === 'Unsure' && styles.selectedButton]}
              onPress={() => handleGetsAlongWithCatsSelect('Unsure')}
            >
              <Text style={styles.buttonText}>Unsure</Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>

        {/* Create Pet Button - Placed Outside ScrollView */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreatePet}>
          <Text style={styles.createButtonText}>Create Pet</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
    paddingHorizontal: width * 0.05,
  },
  scrollView: {
    paddingBottom: height * 0.05,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: width * 0.05, // Dynamic padding based on screen width
    borderRadius: width * 0.02, // Dynamic border radius based on screen width
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: height * 0.01, // Dynamic margin based on screen height
  },
  label: {
    fontSize: width * 0.045, // Dynamic font size based on screen width
    marginBottom: height * 0.01, // Dynamic margin based on screen height
    marginTop: height * 0.02, // Dynamic margin based on screen height
    color: 'black',
    fontFamily:theme.fonts.medium
  },
  input: {
    width: '100%',
    padding: width * 0.025, // Dynamic padding based on screen width
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.02, // Dynamic border radius based on screen width
    backgroundColor: 'white',
    fontFamily:theme.fonts.light
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01, // Dynamic margin based on screen height
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingVertical: height * 0.02, // Dynamic padding based on screen height
    marginHorizontal: width * 0.01, // Dynamic margin based on screen width
    borderRadius: width * 0.02, // Dynamic border radius based on screen width
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: colors.tomato, // Highlight selected button
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.04, // Dynamic font size based on screen width
    fontFamily: theme.fonts.medium
  },
  createButton: {
    backgroundColor: colors.tomato,
    paddingVertical: height* 0.02,
    marginVertical: height * 0.02, // Dynamic padding based on screen height
    marginHorizontal: height * 0.01, // Dynamic margin based on screen height
    borderRadius: width * 0.02, // Dynamic border radius based on screen width
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: width * 0.045, // Dynamic font size based on screen width
    fontFamily:theme.fonts.medium
  },
});

export default CreatePetScreen;
