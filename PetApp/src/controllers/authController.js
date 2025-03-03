const express = require('express');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Route for user registration
router.post('/register', async (req, res) => {
  const {username , email, password} = req.body;  // Destructure to get new fields

  console.log('Register request received:', req.body);

  try {
    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create and save the new user
    const newUser = new User({
      email,
      username,       // Include the new fields
      password,
      sitter: false, // Set sitter to false if not provided
    });

    await newUser.save();

    // Generate a token for the new user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Generated Token:', token);

    // Return the token
    return res.status(201).json({ token });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Route for user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Login request recieved:',req.body);

    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate a JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      console.log("Successful login. Generated token:",token);
  
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  });

module.exports = router;
