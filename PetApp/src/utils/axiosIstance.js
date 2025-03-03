// src/utils/axiosInstance.js

const axios = require('axios');
const AsyncStorage = require('@react-native-async-storage/async-storage'); // Import AsyncStorage for token handling

// Create an Axios instance with the base URL
const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.2:5000/api', // Replace with your backend's base URL
});

// Add a request interceptor to include the JWT token in headers
axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken'); // Get the token from AsyncStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

module.exports = axiosInstance; // Export the Axios instance
