const express = require('express');
const jwt = require('jsonwebtoken'); // Import JWT to decode token
const User = require('../models/userModel'); // Import the User model
const Pet = require('../models/petModel'); // Import the Pet model
const Ad = require('../models/adModel'); // Import the Ad model

const router = express.Router();

// API to add a pet to the user
router.post('/add-pet', async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];  // Extract token from the 'Authorization' header
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Decode token to get userId
      const userId = decoded.id;  // Extract userId
  
      // Get pet data from request body
      const { petData } = req.body;  
  
      // Create new pet
      const newPet = new Pet(petData);
      await newPet.save();
  
      // Add pet ID to user's pets array
      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { pets: newPet._id } },  // Push new pet ID into user's pets array
        { new: true }
      );
  
      res.status(201).json({ message: 'Pet added successfully', user });
    } catch (error) {
      console.error('Error adding pet:', error);
      res.status(500).json({ message: 'Error adding pet', error });
    }
});
  
  

// Return all pets linked to the user
router.get('/pets', async (req, res) => {
    try {
      // Retrieve the token from the Authorization header
      const token = req.headers.authorization.split(' ')[1];  // Extract token from 'Bearer <token>'
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
  
      // Decode the token to get the user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      // Find the user by ID and populate the pets array
      const user = await User.findById(userId).populate('pets');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return all pets linked to the user
      res.status(200).json({ pets: user.pets });
    } catch (error) {
      console.error('Error fetching pets:', error);
      res.status(500).json({ message: 'Error fetching pets', error });
    }
});

router.delete('/delete-pets', async (req, res) => {
  try {
    const { petIds } = req.body; // Expecting an array of pet IDs in the request body

    if (!petIds || !Array.isArray(petIds) || petIds.length === 0) {
      return res.status(400).json({ message: 'No pet IDs provided or invalid input.' });
    }

    // Delete pets from the Pet model
    await Pet.deleteMany({ _id: { $in: petIds } });

    // Remove pets from the user's pets array
    await User.updateMany(
      { pets: { $in: petIds } },
      { $pull: { pets: { $in: petIds } } }
    );

    res.status(200).json({ message: 'Pets deleted successfully.' });
  } catch (error) {
    console.error('Error deleting pets:', error);
    res.status(500).json({ message: 'Error deleting pets', error });
  }
});

router.post('/create-ad', async (req, res) => {
  try {
    // Extract token from the authorization header
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Extract ad data from the request body
    const { pets, serviceType, dates, location } = req.body;

    // Create the new ad
    const newAd = new Ad({
      userId: userId,
      pets: pets,  // Pass the selected pet IDs
      serviceType: serviceType,
      dates: dates,
      location: location
    });

    // Save the ad to the database
    await newAd.save();

    // Send a success response
    res.status(201).json({ message: 'Ad created successfully', ad: newAd });
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).json({ message: 'Error creating ad', error });
  }
});

router.get('/sitters', async (req, res) => {
  try {
    // Extract the token from the authorization header
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find all users where `sitter` is true and exclude the requesting user
    const sitters = await User.find({ sitter: true, _id: { $ne: userId } })
      .select('-password') // Exclude password from results
      .populate('pets', 'name typeOfPet breed') // Populate pets with selected fields (optional)
      .lean(); // Convert mongoose documents to plain JavaScript objects

    // Return all sitters except the requesting user
    res.status(200).json(sitters);
  } catch (error) {
    console.error('Error fetching sitters:', error);
    res.status(500).json({ message: 'Error fetching sitters', error });
  }
});

router.get('/sitters2', async (req, res) => {
  try {
    // Extract service name from the query parameter
    const { serviceType } = req.query;

    if (!serviceType) {
      return res.status(400).json({ message: 'Service type is required' });
    }

    // Normalize the service name to match your MongoDB field names
    //const normalizedServiceType = serviceType.toLowerCase().replace(/[\s-]/g, '');

    // Validate if the service exists in the predefined service types
    const validServices = ['petSitting', 'training', 'petGrooming', 'petWalking', 'petDropOff'];
    if (!validServices.includes(serviceType)) {
      return res.status(400).json({ message: 'Invalid service type' });
    }

    // Get the token and decode it to extract the user ID
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Query the database for sitters who offer this service, excluding the current user
    const sitters = await User.find({
      _id: { $ne: userId },  // Exclude the current user
      sitter: true,
      [`services.${serviceType}.available`]: true
    });

    // Return the list of sitters who can provide the requested service
    res.status(200).json(sitters);

  } catch (error) {
    console.error('Error fetching sitters:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


module.exports = router;
