import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../utils/colors';

const { width, height } = Dimensions.get('window');

const ArrowBackButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.backButton} onPress={onPress}>
      <FontAwesome name="arrow-left" size={28} color={colors.black} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: height * 0.025, // Adjust based on the design
    left: width * 0.05, // Adjust for padding
    zIndex: 10, // Ensure it appears above other elements
  },
});

export default ArrowBackButton;
