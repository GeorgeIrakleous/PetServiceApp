import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

// Import
import UserProfileIcon from './UserProfileIcon'; // Make sure this path is correct
import {theme} from '../utils/theme';

const { width, height } = Dimensions.get('window');

const ChatHeader = ({ otherUsername, navigation, onInfoPress }) => {
  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.headerContainer}>
      {/* Back Button */}
      <TouchableOpacity onPress={handleBackButtonPress} style={styles.backButton}>
        <FontAwesomeIcon name="arrow-left" size={30} color="black" />
      </TouchableOpacity>

      {/* User Profile Icon */}
      <UserProfileIcon size={56}/>

      {/* Username */}
      <Text style={styles.otherUsername}>
        {otherUsername}
      </Text>

      {/* Info Button */}
      <TouchableOpacity onPress={onInfoPress} style={styles.infoButton}>
        <FontAwesomeIcon name="info-circle" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: height * 0.045,
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 1,
    height: height * 0.08,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: width * 0.05, // Adjust spacing for content
    justifyContent: 'space-between', // Align elements properly
  },
  backButton: {
    marginRight: 10,
  },
  otherUsername: {
    fontSize: 26,
    fontFamily:theme.fonts.medium,
    color: 'black',
    marginLeft: 10,
    flex: 1, // Ensure text takes available space
  },
  infoButton: {
    paddingLeft: width * 0.05,
  },
});

export default ChatHeader;
