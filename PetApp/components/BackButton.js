import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const BackButton = ({ title = 'Back' }) => {

  const navigation=useNavigation();

  const handleBackButtonPress=()=>{
    navigation.goBack();
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handleBackButtonPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'tomato',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BackButton;