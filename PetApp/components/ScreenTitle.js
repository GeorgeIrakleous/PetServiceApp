import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

//import
import {theme} from '../utils/theme';

const { width, height } = Dimensions.get('window');

const ScreenTitle = ({ title, showBackArrow = false, onBackPress }) => {
  return (
    <View style={styles.titleContainer}>
      {showBackArrow && (
        <TouchableOpacity onPress={onBackPress} style={styles.arrowContainer}>
          <FontAwesomeIcon name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
      )}
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
    height: height * 0.07,
    justifyContent: 'flex-start',
    marginLeft: width*0.03
  },
  arrowContainer: {
    marginRight: width * 0.02,
  },
  titleText: {
    color: 'black',
    fontSize: 26,
    fontFamily:theme.fonts.medium
  },
});

export default ScreenTitle;
