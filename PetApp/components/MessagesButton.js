import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const MessagesButton = ({ onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <FontAwesomeIcon name="envelope" size={width * 0.06} color='black'  />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: width * 0.1, // 10% of the screen width
    height: width * 0.1, // 10% of the screen width (to make it square)
    borderRadius: (width * 0.1) / 2, // Half of width and height to make it circular
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.05, // 5% of the screen width
    lineHeight: width * 0.05,
  },
});

export default MessagesButton;
