const express = require('express');
const User = require('../models/userModel');
const { protect } = require('../middlewares/authMiddleware'); // Middleware to protect routes

const router = express.Router();

// Fetch user profile data
const jwt = require('jsonwebtoken');

// Fetch user profile data
router.get('/profile', async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];
    
    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Extract the user ID from the token
    const userId = decoded.id;
    
    // Find the user by ID in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data
    res.status(200).json(user);
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

  

// Update user profile data
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, email, sitter } = req.body; // Fields to update

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, sitter },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/become-sitter', async (req, res) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.sitter) {
      return res.status(400).json({ message: 'User is already a sitter' });
    }

    const { services, petSittingExperience } = req.body;

    if (!services || !Object.keys(services).length) {
      return res.status(400).json({ message: 'Missing required services information.' });
    }

    // Ensure all required services are accounted for
    const requiredServices = ['petSitting', 'training', 'petGrooming', 'petWalking', 'petDropOff'];
    const updatedServices = {};

    for (const service of requiredServices) {
      if (services[service]?.available) {
        if (!services[service].hourlyRate) {
          return res.status(400).json({ message: `Missing hourly rate for ${service}.` });
        }
        updatedServices[service] = {
          available: true,
          hourlyRate: services[service].hourlyRate,
        };
      } else {
        // Set unavailable services explicitly
        updatedServices[service] = { available: false };
      }
    }

    if (!petSittingExperience) {
      return res.status(400).json({ message: 'Missing pet sitting experience.' });
    }

    user.sitter = true;
    user.services = updatedServices;
    user.petSittingExperience = petSittingExperience;

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'User is now a sitter',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error becoming sitter:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});



module.exports = router;
