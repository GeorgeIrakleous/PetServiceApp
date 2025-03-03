const mongoose = require('mongoose');

// Define the Message Schema
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

// Define the participant schema to include roles
const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['service requester', 'sitter'],
    required: true,
  },
});

// Define the Chat Schema with conditional fields
const chatSchema = new mongoose.Schema({
  participants: [participantSchema],
  messages: [messageSchema],

  // Service details (for private requests)
  serviceType: {
    type: String,
    required: function() { return !this.adId; }, // Required if adId is not present
  },
  dates: [{
    type: String,
    required: function() { return !this.adId; },
  }],
  location: {
    type: {
      lat: { type: Number, required: function() { return !this.adId; } },
      lng: { type: Number, required: function() { return !this.adId; } },
    },
  },
  pets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: function() { return !this.adId; }, // Required if adId is not present
  }],

  // Ad reference (for public requests)
  adId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
    default: null,
    validate: {
      validator: function(value) {
        return !value || (!this.serviceType && !this.dates.length && !this.location && !this.pets?.length);
      },
      message: 'Chat can have either an adId or service details, but not both.',
    },
  },

  // Agreement fields
  agreementStatus: {
    type: String,
    enum: ['pending', 'agreed', 'declined'],
    default: 'pending',
  },
  agreedByRequester: {
    type: Boolean,
    default: false,
  },
  agreedBySitter: {
    type: Boolean,
    default: false,
  },

  lastMessage: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Middleware to update `updatedAt` on save
chatSchema.pre('save', function(next) {
  if (this.adId && (this.serviceType || this.dates.length || this.location || this.pets?.length)) {
    return next(new Error('Chat can have either an adId or service details, but not both.'));
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Chat', chatSchema);
