const mongoose = require('mongoose');

// Define the service types as an Enum
const SERVICE_TYPES = [
  { id: 1, name: 'Pet Sitting' },
  { id: 2, name: 'Training' },
  { id: 3, name: 'Grooming' },
  { id: 4, name: 'Pet Walking' },
  { id: 5, name: 'Pet Drop-off' },
  { id: 6, name: 'Pet Daycare' },
];

// Define the schema for the Ad model
const adSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,  // Reference to the user placing the ad
  },
  pets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true,  // Reference to selected pets
  }],
  serviceType: {
    type: String,
    enum: SERVICE_TYPES.map(service => service.name),  // Enum for the service types
    required: true,
  },
  // Optionally, use an array of dates for multiple date selection
   dates: [{
     type: String,
     required: true,  // Array of dates for the service
  }],
  location: {
    type: {
      lat: { type: Number, required: true },  // Latitude of the location marker
      lng: { type: Number, required: true },  // Longitude of the location marker
    },
    required: true,
  }
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

// Create and export the Ad model
const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
