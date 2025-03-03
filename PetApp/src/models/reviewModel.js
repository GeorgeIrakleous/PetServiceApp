const mongoose = require('mongoose');

// Define the Review Schema
const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference the User model
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true, // Ensure a rating is always provided
    },
    description: {
      type: String,
      trim: true, // Removes leading/trailing whitespaces
      default: '', // Optional field for additional comments
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Review Model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
