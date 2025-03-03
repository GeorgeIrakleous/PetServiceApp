const express = require('express');
const jwt = require('jsonwebtoken'); // Import JWT for token verification
const Chat = require('../models/chatModel'); // Import Chat model
const User= require('../models/userModel');
const Ad=require('../models/adModel');
const mongoose = require('mongoose');

const router = express.Router();

// Create a new chat between two users
router.post('/chats', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tokenUserId = decoded.id; // User ID from token

    const { userId2, adId, serviceDetails } = req.body;

    let userId, sitterId;

    if (adId) {
      // If there's an adId, the token user is the sitter, and the requester is the ad's owner
      sitterId = tokenUserId;
      userId = userId2; // `userId2` should hold the requester's ID in this case
    } else {
      // For private requests, token user is the requester and `userId2` is the sitter
      userId = tokenUserId;
      sitterId = userId2;
    }

    // Check if the token user is the sitter
    if (sitterId === tokenUserId) {
      // Fetch the service type associated with the ad or request
      const ad = await Ad.findById(adId).select('serviceType');

      // Step 2: Extract the serviceType value into a separate variable
      const fetchedServiceType = ad.serviceType; // Safely access serviceType

      const serviceMapping = {
        'Pet Sitting': 'petSitting',
        'Training': 'training',
        'Grooming': 'petGrooming',
        'Pet Walking': 'petWalking',
        'Pet Drop-off': 'petDropOff',
      };

      // Transform the fetched service type for comparison
      const serviceKey = serviceMapping[fetchedServiceType];

      // Validate the sitter's qualifications
      const sitter = await User.findById(sitterId).select('services');
     
      const sitterService = sitter.services;

      if (!sitterService[serviceKey].available) {
        return res.status(200).json({
          success: false,
          message: 'The sitter does not provide the service needed for this job.',
        });
      }
    }

    // Determine if it's a public or private request
    const isPublicRequest = !!adId;

    // Check if a chat with the same participants and service details exists
    let chat;
    if (isPublicRequest) {
      chat = await Chat.findOne({
        'participants.user': { $all: [userId, sitterId] },
        adId: adId, // Match the specific adId for public requests
      });
    } else {
      chat = await Chat.findOne({
        'participants.user': { $all: [userId, sitterId] },
        serviceType: serviceDetails.serviceType,
        dates: { $all: serviceDetails.dates }, // Match all selected dates
        location: serviceDetails.location,    // Match the location
      });
    }

    // If no matching chat is found, create a new one
    if (!chat) {
      const chatData = {
        participants: [
          { user: userId, role: 'service requester' },
          { user: sitterId, role: 'sitter' },
        ],
        messages: [],
        lastMessage: '',
      };

      if (isPublicRequest) {
        chatData.adId = adId; // Attach adId if public request
      } else {
        // For private requests, include service details directly in chat data
        chatData.serviceType = serviceDetails.serviceType;
        chatData.dates = serviceDetails.dates;
        chatData.location = serviceDetails.location;
        chatData.pets = serviceDetails.pets; // Include pets in the chat data
      }

      chat = new Chat(chatData);
      await chat.save();
    }

    res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});




// Send a message in a chat
router.post('/chats/:chatId/messages', async (req, res) => {
  try {
    // Extract token and verify the user
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { content } = req.body;
    const chatId = req.params.chatId;

    // Find the chat by its ID
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Create the new message
    const newMessage = {
      sender: userId,
      content,
    };

    // Add the message to the chat's messages array
    chat.messages.push(newMessage);
    chat.lastMessage = content;
    await chat.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all chats where the user is the service requester
router.get('/chats/service-requester', async (req, res) => {
  try {
    // Extract token and verify the user
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find all chats where the user is a participant with the role "service requester"
    const chats = await Chat.find({
      participants: { 
        $elemMatch: { user: userId, role: 'service requester' } 
      }
    })
    .populate('participants.user', 'username')  // Fetch usernames of participants
    .populate('messages.sender', 'username');    // Fetch sender's username for messages

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching service requester chats:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all chats where the user is the sitter
router.get('/chats/sitter', async (req, res) => {
  try {
    // Extract token and verify the user
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find all chats where the user is a participant with the role "sitter"
    const chats = await Chat.find({
      participants: { 
        $elemMatch: { user: userId, role: 'sitter' } 
      }
    })
    .populate('participants.user', 'username')  // Fetch usernames of participants
    .populate('messages.sender', 'username');    // Fetch sender's username for messages

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching sitter chats:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get messages in a chat and return participant IDs as well
router.get('/chats/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;

    // Fetch the chat and populate participant user details
    const chat = await Chat.findById(chatId)
      .populate('participants.user', 'username')
      .populate('messages.sender', 'username');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Extract participant IDs
    const participantIds = chat.participants.map((participant) => participant.user._id.toString());

    res.status(200).json({
      participantIds, // Array of user IDs for participants
      messages: chat.messages, // Array of messages
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get details of a specific chat
// Updated /chats/:chatId endpoint
router.get('/chats/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;

    // Find the chat and populate necessary fields
    const chat = await Chat.findById(chatId)
      .populate('participants.user', 'username') // Populate participant usernames
      .populate({
        path: 'adId',
        populate: { path: 'pets', select: 'name typeOfPet breed age petSize getsAlongWithDogs getsAlongWithCats' }, // For public ads
      })
      .populate({
        path: 'pets', // For private requests
        select: 'name typeOfPet breed age petSize getsAlongWithDogs getsAlongWithCats',
      });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Extract the sitter participant
    const sitterParticipant = chat.participants.find((participant) => participant.role === 'sitter');
    if (!sitterParticipant) {
      return res.status(404).json({ message: 'Sitter not found in chat participants.' });
    }

    // Extract service type from chat details (public or private)
    const serviceTypeKey = chat.adId ? chat.adId.serviceType : chat.serviceType;

    // Convert service type to match the key in `services` (e.g., 'petSitting')
    const serviceTypeMap = {
      'petSitting':'petSitting',
      'training':'training',
      'petGrooming':'petGrooming',
      'petWalking':'petWalking',
      'petDropOff':'petDropOff',
      'Pet Sitting': 'petSitting',
      'Training': 'training',
      'Grooming': 'petGrooming',
      'Pet Walking': 'petWalking',
      'Pet Drop-off': 'petDropOff',
    };

    const displayMapping = {
      'petSitting': 'Pet Sitting',
      'training': 'Training',
      'petGrooming': 'Grooming',
      'petWalking': 'Pet Walking',
      'petDropOff': 'Pet Drop-off',
    };
    
    const serviceKey = serviceTypeMap[serviceTypeKey];

    // Enable Mongoose debugging
    //mongoose.set('debug', true);

    // Fetch the sitter's hourly rate for the specific service
    const sitter = await User.findById(sitterParticipant.user).select(`services.${serviceKey}`);
    console.log('Query run for sitter details:', `User.findById(${sitterParticipant.user}).select('services.${serviceKey}')`);
    console.log('Response from database:', sitter);

    // Extract the hourly rate
    const hourlyRate = sitter?.services?.[serviceKey]?.hourlyRate || null;
    console.log('Extracted hourly rate:', hourlyRate);

    // Build the unified response format
    const response = {
      participants: chat.participants.map((participant) => ({
        user: participant.user._id,
        username: participant.user.username,
        role: participant.role,
      })),
      serviceDetails: chat.adId
        ? {
            serviceType: chat.adId.serviceType,
            dates: chat.adId.dates,
            location: chat.adId.location,
            pets: chat.adId.pets,
          }
        : {
            serviceType: chat.serviceType,
            dates: chat.dates,
            location: chat.location,
            pets: chat.pets,
          },
      hourlyRate,
      agreementStatus: chat.agreementStatus,
      agreedByRequester: chat.agreedByRequester,
      agreedBySitter: chat.agreedBySitter,
      lastMessage: chat.lastMessage,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching chat details:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/chats/:chatId/accept', async (req, res) => {
  try {
    // Step 1: Extract token and decode user ID
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    console.log("User ID: ",userId);

    // Step 2: Get chatId from params and fetch the chat
    const { chatId } = req.params;
    console.log("Chat ID1: ",req.params);
    const chat = await Chat.findById(chatId);
    console.log("Chat ID2: ",chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found.' });

    // Step 3: Determine the user's role
    const participant = chat.participants.find((p) => p.user.toString() === userId);
    if (!participant) return res.status(403).json({ message: 'You are not a participant in this chat.' });

    // Step 4: Update the correct field based on the user's role
    if (participant.role === 'sitter') {
      chat.agreedBySitter = !chat.agreedBySitter; // Toggle the agreement status
    } else if (participant.role === 'service requester') {
      chat.agreedByRequester = !chat.agreedByRequester; // Toggle the agreement status
    } else {
      return res.status(400).json({ message: 'Invalid role in chat.' });
    }

    // Step 5: Save the updated chat
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Agreement updated successfully.',
      agreedByRequester: chat.agreedByRequester,
      agreedBySitter: chat.agreedBySitter,
    });
  } catch (error) {
    console.error('Error updating agreement:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});


router.delete('/chats/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findByIdAndDelete(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found.' });

    res.status(200).json({ message: 'Chat deleted successfully.' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});





module.exports = router;
