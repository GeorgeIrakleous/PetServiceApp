import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import
import ChatItem from '../components/ChatItem';
import {colors} from '../utils/colors';
import ScreenTitle from '../components/ScreenTitle';
import {theme} from '../utils/theme';
import { strings } from '../utils/strings';

const MessagesScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('services');
  const [serviceChats, setServiceChats] = useState([]);
  const [jobChats, setJobChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const headers = { Authorization: `Bearer ${token}` };

        let response;
        if (selectedTab === 'services') {
          response = await axios.get(`${strings.baseURL}/messages/chats/service-requester`, { headers });
          setServiceChats(response.data);
        } else {
          response = await axios.get(`${strings.baseURL}/messages/chats/sitter`, { headers });
          setJobChats(response.data);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
        Alert.alert('Error', 'Failed to load chats. Please try again later.');
      }
    };

    fetchChats();
  }, [selectedTab]);

  const handleMessageUserPressed = async (chat) => {
    try {
      // Fetch the logged-in user's ID from the profile
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${strings.baseURL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const currentUserId = response.data._id;
  
      // Find the other user in the chat based on the user ID
      const otherUser = chat.participants.find(
        (participant) => participant.user._id !== currentUserId
      );
  
      // Navigate to the chat screen with the other user's data
      if (otherUser) {
        navigation.navigate('Chat', {
          chatId: chat._id,
          otherUserName: otherUser.user.username,
          otherUserId: otherUser.user._id,
        });
      } else {
        console.error('Could not find the other user in the chat');
      }
    } catch (error) {
      console.error('Error navigating to chat:', error);
      Alert.alert('Error', 'Failed to open chat. Please try again later.');
    }
  };
  

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.container}>
          <ScreenTitle title="Messages" showBackArrow={true} onBackPress={() => navigation.goBack()} />


        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, selectedTab === 'services' && styles.selectedButton]}
            onPress={() => setSelectedTab('services')}
          >
            <Text style={[styles.toggleText, selectedTab === 'services' && styles.selectedText]}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, selectedTab === 'jobs' && styles.selectedButton]}
            onPress={() => setSelectedTab('jobs')}
          >
            <Text style={[styles.toggleText, selectedTab === 'jobs' && styles.selectedText]}>Jobs</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.chatList}>
          {selectedTab === 'services' ? (
            serviceChats.length > 0 ? (
              serviceChats.map((chat) => (
                <ChatItem
                  key={chat._id}
                  chat={chat}
                  onPress={() => handleMessageUserPressed(chat)}
                  role="sitter"
                />
              ))
            ) : (
              <Text>No service chats found.</Text>
            )
          ) : (
            jobChats.length > 0 ? (
              jobChats.map((chat) => (
                <ChatItem
                  key={chat._id}
                  chat={chat}
                  onPress={() => handleMessageUserPressed(chat)}
                  role="service requester"
                />
              ))
            ) : (
              <Text>No job chats found.</Text>
            )
          )}
        </ScrollView>

        <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/myImages/catWithPhone.jpg')}
          style={styles.image}
        />
      </View> 
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer:{
    flex:1,
    backgroundColor:colors.messagesBackgroundColor
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    backgroundColor: colors.messagesBackgroundColor,
    padding: 10,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    backgroundColor: '#ccc', // Default background for non-selected
    borderWidth: 2, // Add border width
    borderColor: colors.black, // Default border color for non-selected
  },
  selectedButton: {
    backgroundColor: colors.tomato,
    borderColor: colors.black,
  },
  toggleText: {
    fontSize: 16,
    color: '#555',
    fontFamily:theme.fonts.medium
  },
  selectedText: {
    color: '#fff',
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor:colors.messagesBackgroundColor
  },
  imageContainer:{
    flex:1/2.7,
    backgroundColor: '#D4D4C9'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode:'stretch'
  },
});

export default MessagesScreen;
