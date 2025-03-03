import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For stars
import axios from 'axios';

//import
import ReviewCard from '../components/ReviewCard';
import { colors } from '../utils/colors';
import ArrowBackButton from '../components/ArrowBackButton';
import {theme} from '../utils/theme';
import { strings } from '../utils/strings';

const { width, height } = Dimensions.get('window');

const ReviewScreen = ({ navigation }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingsDistribution, setRatingsDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${strings.baseURL}/review/all-reviews`);
      const data = response.data;
  
      setReviews(data.reviews); // Each review now contains `userId.username`
      setAverageRating(parseFloat(data.averageRating).toFixed(1));
      setRatingsDistribution(data.ratingCounts);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FontAwesome
        key={i}
        name="star"
        size={24}
        color={i < rating ? colors.tomato : colors.grey}
      />
    ));
  };

  const renderRatingBar = (label, percentage, color) => (
    <View style={styles.ratingRow}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.ratingBarContainer}>
        <View style={[styles.ratingBar, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.ratingPercentage}>{`${percentage.toFixed(1)}%`}</Text>
    </View>
  );

  const getTotalReviews = () =>
    Object.values(ratingsDistribution).reduce((sum, count) => sum + count, 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={36} color={colors.tomato} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ArrowBackButton onPress={() => navigation.goBack()} />
      {/* Reviews Summary Container */}
      <View style={styles.summaryContainer}>
        <Text style={styles.title}>Reviews</Text>

        {/* Average Rating */}
        <Text style={styles.averageRating}>{averageRating}</Text>

        {/* Stars */}
        <View style={styles.starsContainer}>{renderStars(Math.round(averageRating))}</View>

        {/* Total Reviews */}
        <Text style={styles.totalReviews}>Based on {getTotalReviews()} reviews</Text>

        {/* Ratings Distribution */}
        <View style={styles.ratingBars}>
          {renderRatingBar('Excellent', (ratingsDistribution[5] / getTotalReviews()) * 100, colors.green)}
          {renderRatingBar('Good', (ratingsDistribution[4] / getTotalReviews()) * 100, colors.lightGreen)}
          {renderRatingBar('Average', (ratingsDistribution[3] / getTotalReviews()) * 100, colors.yellow)}
          {renderRatingBar('Below Average', (ratingsDistribution[2] / getTotalReviews()) * 100, colors.orange)}
          {renderRatingBar('Poor', (ratingsDistribution[1] / getTotalReviews()) * 100, colors.red)}
        </View>
      </View>

      {/* Reviews List Container */}
      <ScrollView style={styles.reviewsContainer}>
        {reviews.map((review) => (
          <ReviewCard key={review._id} rating={review.rating} description={review.description} username={review.userId.username} />
        ))}
        <View style={{marginBottom:height*0.03}}></View>
      </ScrollView>

      {/* Write Review Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.writeButton}
          onPress={() => navigation.navigate('WriteReview', { refreshReviews: fetchReviews })} // Navigate to Write Review screen
        >
          <Text style={styles.writeButtonText}>Write a Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGrey },
  summaryContainer: {
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.grey,
  },
  title: {
    fontSize: 24,
    fontFamily:theme.fonts.bold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 10,
  },
  averageRating: {
    fontSize: 40,
    fontFamily:theme.fonts.bold,
    color: colors.black,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  totalReviews: {
    fontSize: 16,
    color: colors.darkGrey,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily:theme.fonts.medium
  },
  ratingBars: {
    marginTop: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingLabel: {
    flex: 2,
    fontSize: 14,
    color: colors.black,
    fontFamily:theme.fonts.regular
  },
  ratingBarContainer: {
    flex: 4,
    height: 10,
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
  },
  ratingPercentage: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily:theme.fonts.regular
  },
  reviewsContainer: {
    flex: 1,
    padding: 20,
  },
  reviewCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewDescription: {
    fontSize: 14,
    color: colors.black,
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.grey,
  },
  writeButton: {
    backgroundColor: colors.tomato,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  writeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily:theme.fonts.medium
  },
});
