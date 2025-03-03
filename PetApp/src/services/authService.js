// Import necessary modules
const User = require('../models/userModel');  // Import the User model
const jwt = require('jsonwebtoken');         // Import JWT for token generation
const bcrypt = require('bcryptjs');          // Import bcrypt for password hashing
require('dotenv').config();                  // Import dotenv to access environment variables

// Register a new user
const registerUser = async (email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();

  return generateToken(user._id);
};

// Authenticate a user and return a JWT token
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return generateToken(user._id);
};

// Generate a JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Export the functions
module.exports = {
  registerUser,
  loginUser,
};
