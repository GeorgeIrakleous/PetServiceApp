const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./controllers/authController');
const profileRoutes = require('./controllers/profileController');
const servicesRoutes = require('./controllers/serviceController');
const jobsRoutes = require('./controllers/jobController');
const messagesRoutes= require('./controllers/messageController');
const reviewRoutes=require('./controllers/reviewController');
require('dotenv').config();  // Load environment variables

const app = express();  // Initialize Express app

// Middleware
app.use(cors());  // Enable Cross-Origin Resource Sharing
app.use(express.json());  // Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes);  // Mount the auth routes at /api/auth
app.use('/api/user', profileRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/messages',messagesRoutes);
app.use('/api/review',reviewRoutes);

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// No need to export `io` yet unless you want to use it in route handlers
module.exports = app;
