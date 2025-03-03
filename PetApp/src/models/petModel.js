const mongoose = require('mongoose');

// Define the schema for the Pet model
const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Ensure that a name is provided
  },
  typeOfPet: {
    type: String,
    enum: ['Dog', 'Cat'], // Ensure only predefined values are allowed
    required: true,
  },
  age: {
    type: String,
    enum: ['Puppy', 'Adult'], // Ensure only 'Puppy' or 'Adult' can be selected
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  petSize: {
    type: String,
    enum: ['1-5 kg', '6-15 kg', '16-30 kg', '31+ kg'], // Ensure only predefined size ranges are allowed
    required: true,
  },
  getsAlongWithDogs: {
    type: String,
    enum: ['Yes', 'No', 'Unsure'], // Added 'Unsure' as an option
    required: true,
  },
  getsAlongWithCats: {
    type: String,
    enum: ['Yes', 'No', 'Unsure'], // Added 'Unsure' as an option
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create and export the model
const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
