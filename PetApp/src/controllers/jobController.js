const express = require('express');
const jwt = require('jsonwebtoken'); // Import JWT to decode token
const User = require('../models/userModel'); // Import the User model
const Pet = require('../models/petModel'); // Import the Pet model
const Ad = require('../models/adModel'); // Import the Ad model

const router = express.Router();

// API to get ads with filtering options
router.get('/ads', async (req, res) => {
    try {
      const { serviceTypes, lat, lng, radius, date } = req.query;
  
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      let query = { userId: { $ne: userId } };
  
      // Add filtering for multiple service types if provided
      if (serviceTypes) {
        const typesArray = serviceTypes.split(',');
        query.serviceType = { $in: typesArray };
      }
  
      // Add filtering by date if provided
      if (date) {
        query.dates = { $in: [date] };
      }
  
      // Add filtering by location if lat, lng, and radius are provided
      if (lat && lng && radius) {
        const radiusInMeters = radius * 1000;
        query.location = {
          $geoWithin: {
            $centerSphere: [[lng, lat], radiusInMeters / 6378.1],
          },
        };
      }
  
      const ads = await Ad.find(query)
        .populate('userId', 'username email')
        .populate('pets', 'name typeOfPet breed age petSize getsAlongWithDogs getsAlongWithCats');
  
      res.status(200).json(ads);
    } catch (error) {
      console.error('Error fetching ads:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
  // DELETE API to remove an ad
router.delete('/ads/:adId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token required.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Extract user ID from token

    const { adId } = req.params;

    // Find the ad to verify ownership
    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found.' });
    }

    // Check if the ad belongs to the user
    if (ad.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this ad.' });
    }

    // Delete the ad
    await Ad.findByIdAndDelete(adId);

    res.status(200).json({ message: 'Ad deleted successfully.' });
  } catch (error) {
    console.error('Error deleting ad:', error);
    res.status(500).json({ message: 'Server error.', error });
  }
});

  

module.exports = router;