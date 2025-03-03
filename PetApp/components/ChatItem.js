// ChatItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet , Dimensions} from 'react-native';

//import
import UserProfileIcon from "./UserProfileIcon";
import {colors} from '../utils/colors';
import {theme} from '../utils/theme';

const { width, height } = Dimensions.get('window');

const ChatItem = ({ chat, onPress, role }) => {
  // Find the other user based on the role
  const otherUser = chat.participants.find((p) => p.role === role).user;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <UserProfileIcon size={height*0.08}/>
        <Text style={styles.chatText}>{otherUser.username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderBlockColor:colors.black,
  },
  chatText: {
    fontSize: 24,
    color: '#333',
    alignSelf:'center',
    marginLeft:width*0.05,
    fontFamily:theme.fonts.medium
  },
});

export default ChatItem;
