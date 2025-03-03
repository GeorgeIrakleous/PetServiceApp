import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

//import
import { colors } from '../utils/colors';
import UserProfileIcon from './UserProfileIcon'; // Assuming you already have this component
import {theme} from '../utils/theme';

const { width, height } = Dimensions.get('window');

const SitterCard = ({ sitter, serviceType, formattedServiceType, onSelect }) => {
  return (
    <View style={styles.sitterBox}>
      <View style={styles.sitterHeader}>
        {/* User Icon */}
        <UserProfileIcon size={width * 0.2} />
        {/* Username */}
        <Text style={styles.sitterName}>{sitter.username}</Text>
      </View>
      <Text style={styles.serviceRate}>
        {formattedServiceType} Rate: €{sitter.services[serviceType]?.hourlyRate}/hr
      </Text>
      <TouchableOpacity style={styles.selectButton} onPress={() => onSelect(sitter)}>
        <Text style={styles.buttonText}>Select</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sitterBox: {
    backgroundColor: 'white',
    padding: width * 0.05,
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: height * 0.01,
    borderRadius: 20,
  },
  sitterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.0,
  },
  sitterName: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: colors.black,
    marginLeft: width * 0.03, // Spacing between the icon and username
    fontFamily:theme.fonts.medium
  },
  serviceRate: {
    fontSize: width * 0.04,
    color: colors.darkGrey,
    marginVertical: height * 0.01,
    fontFamily:theme.fonts.regular
  },
  selectButton: {
    backgroundColor: colors.tomato,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontFamily:theme.fonts.medium
  },
});

export default SitterCard;
