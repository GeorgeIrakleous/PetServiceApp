const express = require('express');
const jwt = require('jsonwebtoken'); // For token verification
const Review = require('../models/reviewModel'); // Import the Review model
const User = require('../models/userModel'); // Import the User model

const router = express.Router();

// API to create a new review
router.post('/create-review', async (req, res) => {
  try {
    // Extract token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract required fields from the request body
    const { rating, description } = req.body;

    // Validate the rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Create the new review
    const newReview = new Review({
      userId,
      rating,
      description,
    });

    // Save the review to the database
    const savedReview = await newReview.save();

    res.status(201).json({ message: 'Review created successfully', review: savedReview });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/all-reviews', async (req, res) => {
    try {
      // Fetch all reviews with the user details
      const reviews = await Review.find().populate('userId', 'username');
  
      // Calculate total reviews and average rating
      const totalReviews = reviews.length;
      const averageRating =
        totalReviews > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
          : 0;
  
      // Count the ratings distribution
      const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach((review) => {
        ratingCounts[review.rating]++;
      });
  
      res.status(200).json({
        reviews,
        totalReviews,
        averageRating,
        ratingCounts,
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });

module.exports = router;
