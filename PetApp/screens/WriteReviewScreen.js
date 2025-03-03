import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import
import { colors } from '../utils/colors';
import ScreenTitle from '../components/ScreenTitle'; // Custom title component
import {theme} from '../utils/theme';
import { strings } from '../utils/strings';

const { width, height } = Dimensions.get('window');

const WriteReviewScreen = ({ navigation,route }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const { refreshReviews } = route.params || {}; // Get the callback function

  const handleSubmit = async () => {
    if (!rating || rating < 1 || rating > 5) {
      return Alert.alert('Invalid Rating', 'Please select a rating between 1 and 5.');
    }

    if (!reviewText.trim()) {
      return Alert.alert('Empty Review', 'Please write something in the review.');
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${strings.baseURL}/review/create-review`,
        {
          rating,
          description: reviewText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Alert.alert('Success', 'Review submitted successfully!');
        navigation.goBack(); // Go back to the previous screen
      }
      if (refreshReviews) {
        refreshReviews();
      }

    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit the review.');
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
        <Text style={[styles.star, { color: index < rating ? colors.tomato : colors.grey }]}>
          ★
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <>
      <ScreenTitle title="Write a Review" showBackArrow={true} onBackPress={() => navigation.goBack()}/>
      <View style={styles.container}>
        {/* Screen Title */}
        

        {/* Rating Selection */}
        <View style={styles.ratingContainer}>
          <Text style={styles.label}>Rate Your Experience</Text>
          <View style={styles.starsContainer}>{renderStars()}</View>
        </View>

        {/* Review Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write your review here..."
            placeholderTextColor={colors.darkGrey}
            value={reviewText}
            onChangeText={setReviewText}
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
    padding: 20,
  },
  ratingContainer: {
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  label: {
    fontSize: 18,
    fontFamily:theme.fonts.medium,
    color: colors.black,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 40,
    marginHorizontal: 5,
  },
  inputContainer: {
    flex: 1,
    marginVertical: height * 0.03,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey,
    padding: 15,
  },
  input: {
    fontSize: 16,
    color: colors.black,
    height: '100%',
    fontFamily:theme.fonts.regular
  },
  buttonContainer: {
    paddingVertical: height * 0.02,
  },
  submitButton: {
    backgroundColor: colors.tomato,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily:theme.fonts.medium
  },
});

export default WriteReviewScreen;
