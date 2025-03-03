import React from 'react';
import { Dimensions,View, Text, StyleSheet, TouchableOpacity } from 'react-native';

//import
import { colors } from '../utils/colors';
import {theme} from '../utils/theme';

const { width, height } = Dimensions.get('window');

const JobItem = ({ title, user, dates, pets, onPress }) => {
  // Format dates to be readable
  const formattedDates = dates.join(', '); // Example: '2024-11-20, 2024-11-21'

  // Format pets information
  const petSummary = pets && pets.length > 0
    ? `${pets.length} pet(s) (${pets.map((pet) => pet.typeOfPet).join(', ')})`
    : 'No pets listed';

  return (
    <TouchableOpacity style={styles.jobBox} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.userInfo}>Posted by: {user}</Text>
      <Text style={styles.info}>Dates: {formattedDates}</Text>
      <Text style={styles.info}>Pets: {petSummary}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  jobBox: {
    width:width*0.9,
    backgroundColor: 'white',
    padding: width * 0.05,
    marginHorizontal: width * 0.015,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: height * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: width * 0.05,
    color: colors.tomato,
    marginBottom: height * 0.01,
    fontFamily: theme.fonts.medium
  },
  userInfo: {
    fontSize: width * 0.04,
    color: colors.darkGrey,
    marginBottom: height * 0.01,
    fontFamily:theme.fonts.regular
  },
  info: {
    fontSize: width * 0.04,
    color: colors.darkerGrey,
    marginBottom: height * 0.01,
    fontFamily:theme.fonts.regular
  },
});

export default JobItem;
