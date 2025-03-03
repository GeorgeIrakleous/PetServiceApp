import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, View } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

//import
import {theme} from '../utils/theme';

const { width, height } = Dimensions.get('window');

const FilterButton = ({ onPress }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <FontAwesomeIcon name="filter" size={width * 0.06} color="white" />
        <Text style={styles.text}>Filter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer:{
    width:width*0.3,
    justifyContent:'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6347', // Tomato color
    borderRadius: 20,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    elevation: 3, // Adds shadow on Android
    shadowColor: '#000', // Adds shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginLeft: width * 0.02,
    fontFamily:theme.fonts.medium
  },
});

export default FilterButton;
