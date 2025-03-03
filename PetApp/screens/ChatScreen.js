import React, { useState, useEffect, useRef } from 'react';
import { Image,View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Modal, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars'; 
import MapView, { Marker } from 'react-native-maps'; 
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

//import
import ChatHeader from '../components/ChatHeader';
import { colors } from '../utils/colors';
import OfferButtons from '../components/OfferButtons';
import ScreenTitle from '../components/ScreenTitle';
import { theme } from '../utils/theme';
import {strings} from '../utils/strings';

const { width, height } = Dimensions.get('window');

const ChatScreen = ({ navigation, route }) => {
  const serviceTypeDisplayMapping = {
    'petSitting': 'Pet Sitting',
    'training': 'Training',
    'petGrooming': 'Grooming',
    'petWalking': 'Pet Walking',
    'petDropOff': 'Pet Drop-off',
  };
  
  const formatServiceType = (serviceType) => 
    serviceTypeDisplayMapping[serviceType] || serviceType;
  

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatDetails, setChatDetails] = useState({
    participants: [],
    serviceDetails: {
      serviceType: '',
      dates: [],
      location: { lat: null, lng: null },
      pets: [],
    },
    hourlyRate: null, // Add hourlyRate to the structure
    agreementStatus: 'pending',
    agreedByRequester: false,
    agreedBySitter: false,
    lastMessage: '',
  });
  
  
  console.log('ChatDetails:', chatDetails);
  
  const [isModalVisible, setModalVisible] = useState(false); // Modal state
  const { chatId, otherUserName } = route.params;
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState('');
  const scrollViewRef = useRef();

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getUserIdFromToken();
  }, []);

  useEffect(() => {
    const connectSocket = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const newSocket = io(`${strings.baseURL}`, {
        query: { token, chatId },
      });
      setSocket(newSocket);

      newSocket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => newSocket.disconnect();
    };
    connectSocket();
  }, [chatId]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${strings.baseURL}/messages/chats/${chatId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchChatHistory();
  }, [chatId]);
  
  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${strings.baseURL}/messages/chats/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        //console.log('API Response:', response.data); // Validate the response structure
        setChatDetails(response.data);
        

      } catch (error) {
        console.error('Error fetching chat details:', error);
      }
    };
  
    fetchChatDetails();
    //console.log("Run");
  }, [chatId]);
  
  
  //console.log('ChatDetails after calling API:', JSON.stringify(chatDetails, null, 2));

  const handleAcceptOffer = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
  
      // Find the user's role in the chat
      const requesterParticipant = chatDetails.participants.find((p) => p.role === 'service requester');
      const sitterParticipant = chatDetails.participants.find((p) => p.role === 'sitter');
  
      const isRequester = requesterParticipant?.user === userId;
      const isSitter = sitterParticipant?.user === userId;
  
      // Make the API call to accept/undo
      await axios.put(
        `${strings.baseURL}/messages/chats/${chatId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Update UI after successful request
      setChatDetails((prev) => {
        const newAgreedByRequester = isRequester ? !prev.agreedByRequester : prev.agreedByRequester;
        const newAgreedBySitter = isSitter ? !prev.agreedBySitter : prev.agreedBySitter;
  
        // Check if both users agreed
        if (newAgreedByRequester && newAgreedBySitter) {
          Alert.alert('Deal Closed', 'Both parties have accepted the offer. The deal is finalized.');
  
          // Delete the ad if it's a public ad
          if (prev.adId) {
            deleteAd(prev.adId);
          }
        } else if (isRequester ? newAgreedByRequester : newAgreedBySitter) {
          Alert.alert(
            'Offer Accepted',
            'You have accepted the offer. If the other user accepts, the deal will be finalized.'
          );
        } else {
          Alert.alert(
            'Offer Revoked',
            'You have undone your acceptance. The offer is no longer accepted.'
          );
        }
  
        return {
          ...prev,
          agreedByRequester: newAgreedByRequester,
          agreedBySitter: newAgreedBySitter,
        };
      });
    } catch (error) {
      console.error('Error accepting offer:', error);
    }
  };
  
  const deleteAd = async (adId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.delete(`${strings.baseURL}/ads/${adId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`Ad ${adId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting ad ${adId}:`, error);
    }
  };
  
  const renderOfferButtons = () => {
    const bothAgreed = chatDetails.agreedByRequester && chatDetails.agreedBySitter;
  
    if (bothAgreed) return null; // Don't render buttons if both agreed
  
    return (
      <OfferButtons
        chatDetails={chatDetails}
        userId={userId}
        onAccept={handleAcceptOffer}
        onDecline={handleDeclineOffer}
      />
    );
  };
  
  const renderDealClosedMessage = () => {
    const bothAgreed = chatDetails.agreedByRequester && chatDetails.agreedBySitter;
  
    if (!bothAgreed) return null;
  
    return (
      <View style={styles.dealClosedContainer}>    
        <Text style={styles.dealClosedText}>
          The deal is closed! Congratulations!
        </Text>

        <Image
          source={require('../assets/myImages/puppyThumbsUp.jpg')}
          style={styles.dealClosedImageLarge}
        />
      </View>
    );
  };
  
  
  
  
  const handleDeclineOffer = async () => {
    try {
      setIsProcessing(true);
      const token = await AsyncStorage.getItem('userToken');
      await axios.delete(`${strings.baseURL}/messages/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'You have declined the offer.');
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      console.error('Error declining offer:', error);
      Alert.alert('Error', 'Failed to decline the offer. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };


  const getUserIdFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const response = await axios.get(`${strings.baseURL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = response.data._id;
        setUserId(userId);
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const token = await AsyncStorage.getItem('userToken');
    const messageData = {
      content: newMessage,
      sender: { _id: userId },
      timestamp: new Date(),
    };

    socket.emit('sendMessage', messageData);

    try {
      await axios.post(
        `${strings.baseURL}/messages/chats/${chatId}/messages`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ChatHeader 
        otherUsername={otherUserName} 
        navigation={navigation} 
        onInfoPress={() => setModalVisible(true)} // Open modal on info button press
      />

      {/* Deal Closed Message */}
      {renderDealClosedMessage()}

      <ScrollView ref={scrollViewRef} style={styles.chatContainer}>
      {messages.map((msg, index) => {
        const isSent = msg.sender._id === userId; // Determine if the message was sent by the user
        return (
          <View key={index} style={styles.messageWrapper}>
            <View style={[styles.message, isSent ? styles.sent : styles.received]}>
              <Text style={styles.messageStyle}>{msg.content}</Text>
            </View>
            <Text style={[styles.timestamp, isSent ? styles.timestampRight : styles.timestampLeft]}>
              {new Date(msg.timestamp).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}, 
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        );
      })}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

    {/* Modal for Chat Details */}
    <Modal
      visible={isModalVisible}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >

      <TouchableOpacity 
            style={styles.modalCloseButton} 
            onPress={() => setModalVisible(false)}
          >
        <Text style={styles.modalCloseButtonText}>✕</Text>
      </TouchableOpacity>

      <ScreenTitle title="Service Details"/>

      <View style={styles.modalContainer}>

        {/* Deal Closed Message */}
        {renderDealClosedMessage()}

        <ScrollView contentContainerStyle={styles.modalScrollContent}>


        <View>
          {renderOfferButtons()}
        </View>


          {/* Service Type */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Service Type</Text>
            <Text style={styles.infoText}>
              {formatServiceType(chatDetails?.serviceDetails?.serviceType || 'N/A')}
            </Text>
          </View>

          {/* Hourly Rate */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Hourly Rate</Text>
            <Text style={styles.infoText}>
              €{chatDetails?.hourlyRate || 'N/A'}/hr
            </Text>
          </View>

          {/* Pets */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Pets</Text>
            {chatDetails?.serviceDetails?.pets?.length > 0 ? (
              chatDetails.serviceDetails.pets.map((pet, index) => (
                <View key={index} style={styles.petBox}>
                  {/* Pet Icon */}
                  <Image
                    source={
                      pet.typeOfPet === 'Dog'
                        ? require('../assets/myImages/dog_icon.png')
                        : require('../assets/myImages/cat_icon.png')
                    }
                    style={styles.petIcon}
                  />

                  {/* Pet Details */}
                  <Text style={styles.petInfoText}>
                    <Text style={styles.petLabel}>Name: </Text>
                    {pet.name || 'N/A'}
                  </Text>
                  <Text style={styles.petInfoText}>
                    <Text style={styles.petLabel}>Type: </Text>
                    {pet.typeOfPet || 'N/A'}
                  </Text>
                  <Text style={styles.petInfoText}>
                    <Text style={styles.petLabel}>Breed: </Text>
                    {pet.breed || 'N/A'}
                  </Text>
                  <Text style={styles.petInfoText}>
                    <Text style={styles.petLabel}>Age: </Text>
                    {pet.age || 'N/A'}
                  </Text>
                  <Text style={styles.petInfoText}>
                    <Text style={styles.petLabel}>Size: </Text>
                    {pet.petSize || 'N/A'}
                  </Text>
                  <Text style={styles.petInfoText}>
                    <Text style={styles.petLabel}>Gets Along with Dogs: </Text>
                    {pet.getsAlongWithDogs || 'N/A'}
                  </Text>
                  <Text style={styles.petInfoText}>
                    <Text style={styles.petLabel}>Gets Along with Cats: </Text>
                    {pet.getsAlongWithCats || 'N/A'}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.infoText}>No pets listed</Text>
            )}
          </View>

          {/* Dates */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Dates</Text>
            <Calendar
              style={styles.calendar}
              markingType="multi-dot"
              markedDates={
                chatDetails?.serviceDetails?.dates?.reduce((acc, date) => {
                  acc[date] = {
                    selected: true,
                    textColor: colors.tomato,
                    selectedColor: colors.tomato,
                  };
                  return acc;
                }, {}) || {}
              }
              disableAllTouchEventsForDisabledDays={true}
            />
          </View>

          {/* Map */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: chatDetails?.serviceDetails?.location?.lat || 0,
                longitude: chatDetails?.serviceDetails?.location?.lng || 0,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={{
                  latitude: chatDetails?.serviceDetails?.location?.lat || 0,
                  longitude: chatDetails?.serviceDetails?.location?.lng || 0,
                }}
                title="Service Location"
              />
            </MapView>
          </View>

        </ScrollView>
      </View>
    </Modal>




    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 ,backgroundColor:colors.lightGrey},
  chatContainer: { padding: 10, flex: 1, marginBottom: height * 0.01 },
  message: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '80%' },
  sent: { backgroundColor: '#d1e7ff', alignSelf: 'flex-end' ,borderWidth:1,borderBlockColor:colors.darkerGrey},
  received: { backgroundColor: '#eee', alignSelf: 'flex-start' ,borderWidth:1,borderBlockColor:colors.darkerGrey},
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, borderRadius: 20, paddingHorizontal: 10,fontFamily:theme.fonts.regular },
  sendButton: { marginLeft: 10, justifyContent: 'center', paddingHorizontal: 20, backgroundColor: '#ff6347', borderRadius: 20 },
  sendButtonText: { color: '#fff', fontFamily:theme.fonts.medium},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF6347',
  },
  modalScrollContent: {
    padding: width * 0.05,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: width * 0.05,
    borderRadius: 10,
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  userInfo: {
    marginLeft: width * 0.05,
  },
  infoBox: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: width * 0.05,
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily:theme.fonts.medium,
    color: colors.tomato, // Tomato color for field titles
    marginBottom: height * 0.01,
  },
  infoText: {
    fontSize: 16,
    color: colors.black,
    fontFamily:theme.fonts.regular
  },
  petBox: {
    marginBottom: height * 0.02,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey,
    position: 'relative',
  },
  petIcon: {
    width: width * 0.15,
    height: width * 0.15,
    position: 'absolute',
    top: height * 0.02,
    right: width * 0.04,
    resizeMode: 'contain',
  },
  calendar: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  mapContainer: {
    height: height * 0.3,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: height * 0.02,
  },
  map: {
    flex: 1,
  },
  closeButton: {
    marginTop: height * 0.02,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: colors.tomato,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  petBox: {
    marginBottom: height * 0.02,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey,
    position: 'relative',
  },
  petInfoText: {
    fontSize: 16,
    color: colors.black,
    marginBottom: height * 0.005,
    fontFamily:theme.fonts.regular
  },
  petLabel: {
    fontFamily:theme.fonts.medium,
    color: colors.tomato,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust alignment for left and right
    paddingVertical: height * 0.02,
    backgroundColor: colors.white, // Matches modal style
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey,
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.05, // Add horizontal padding for spacing
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  actionBox: {
    alignItems: 'center',
    flex: 1, // Equally distribute space
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: '40%',
  },  
  icon: {
    width: width * 0.1, // Adjust icon size as needed
    height: width * 0.1,
    resizeMode: 'contain',
  },
  acceptButton: {
    backgroundColor: colors.green,
  },
  undoButton: {
    backgroundColor: colors.orange,
  },
  declineButton: {
    backgroundColor: colors.red,
  },
  dealClosedContainer: {
    flexDirection: 'row', // Align the image and text horizontally
    alignItems: 'center',
    backgroundColor: colors.white, // Neutral background color
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderRadius: 10,
    marginVertical: height * 0.01,
    backgroundColor: colors.lightGrey
  },
  
  dealClosedImage: {
    width: 60, // Small size for the image
    height: 60,
    borderRadius: 20, // Make it round
    marginRight: width * 0.03, // Space between image and text
    marginLeft: width*0.05,
  },
  
  dealClosedText: {
    color: colors.black, // Neutral text color
    fontSize: 16,
    fontFamily:theme.fonts.medium,
    textAlign: 'left',
  },
  dealClosedImageLarge: {
    width: 100, // Larger size for emphasis
    height: 100,
    borderRadius: 50, // Make it round
    marginBottom: height * 0.02, // Add spacing below the image
  },
  modalCloseButton: {
    position: 'absolute',
    top: 20, // Adjust as needed for spacing
    right: 20, // Adjust as needed for spacing
    zIndex: 10, // Ensure it's above other elements
  },
  modalCloseButtonText: {
    color: colors.tomato,
    fontSize: 24, // Make it a prominent "X"
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: colors.darkGrey,
    alignSelf: 'flex-end', // Align timestamp to the right of the screen
    marginTop: 2, // Slight space between the message and the timestamp
    fontFamily:theme.fonts.light
  },
  messageWrapper: {
    marginBottom: 10, // Add spacing between messages
  },
  timestampRight: {
    alignSelf: 'flex-end', // Align to the right for sent messages
  },
  timestampLeft: {
    alignSelf: 'flex-start', // Align to the left for received messages
  },
  messageStyle:{
    fontFamily:theme.fonts.regular,
  }
  
});

export default ChatScreen;
