const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  sitter: {
    type: Boolean,
    default: false, // Defaults to false (not a sitter)
  },
  // Optional fields for sitters, validated only if `sitter` is true
  services: {
    petSitting: {
      available: {
        type: Boolean,
        default: false,  // Service is unavailable by default
      },
      hourlyRate: {
        type: Number,
        required: function() {
          return this.sitter && this.services.petSitting.available;
        },
      }
    },
    training: {
      available: {
        type: Boolean,
        default: false,
      },
      hourlyRate: {
        type: Number,
        required: function() {
          return this.sitter && this.services.training.available;
        },
      }
    },
    petGrooming: {
      available: {
        type: Boolean,
        default: false,
      },
      hourlyRate: {
        type: Number,
        required: function() {
          return this.sitter && this.services.petGrooming.available;
        },
      }
    },
    petWalking: {
      available: {
        type: Boolean,
        default: false,
      },
      hourlyRate: {
        type: Number,
        required: function() {
          return this.sitter && this.services.petWalking.available;
        },
      }
    },
    petDropOff: {
      available: {
        type: Boolean,
        default: false,
      },
      hourlyRate: {
        type: Number,
        required: function() {
          return this.sitter && this.services.petDropOff.available;
        },
      }
    },
  },
  petSittingExperience: {
    type: String,
    required: function() {
      return this.sitter;  // Required only if the user is a sitter
    },
  },
  pets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',  // Reference to the Pet model
  }],
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Password hashing middleware before saving the user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
