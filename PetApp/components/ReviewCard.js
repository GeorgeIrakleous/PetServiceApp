import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For stars

//import
import UserProfileIcon from './UserProfileIcon'; // Custom user icon component
import { colors } from '../utils/colors';
import {theme} from '../utils/theme';

const { width } = Dimensions.get('window');

const ReviewCard = ({ username, rating, description }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FontAwesome
        key={i}
        name="star"
        size={18}
        color={i < rating ? colors.tomato : colors.grey}
      />
    ));
  };

  return (
    <View style={styles.card}>
      {/* User and Rating Section */}
      <View style={styles.userContainer}>
        {/* User Profile Icon */}
        <UserProfileIcon size={50} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <View style={styles.rating}>{renderStars(rating)}</View>
        </View>
      </View>

      {/* Review Description */}
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey,
    
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    marginLeft: 10, // Space between icon and user details
  },
  username: {
    fontSize: 16,
    fontFamily:theme.fonts.medium,
    color: colors.black,
  },
  rating: {
    flexDirection: 'row',
    marginTop: 2, // Small space between username and stars
  },
  description: {
    fontSize: 14,
    color: colors.black,
    fontFamily:theme.fonts.regular
  },
});

export default ReviewCard;
