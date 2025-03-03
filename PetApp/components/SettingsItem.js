import React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

//import
import {theme} from '../utils/theme';

const { width, height } = Dimensions.get('window');

const SettingsItem = ({ title, iconName, fun, textStyle }) => {
  return (
    <TouchableOpacity onPress={fun}>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon style={styles.iconStyle} name={iconName} size={width * 0.08} />
          </View>
          {/* Apply textStyle prop */}
          <Text style={[styles.text, textStyle]}>{title}</Text>
          <FontAwesomeIcon style={styles.arrowIconStyle} name="arrow-right" size={width * 0.06} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.06,
    width: width * 0.8,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#696969',
    marginTop: height * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: width * 0.05,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: width * 0.1, // Set a fixed width for the icon container
    alignItems: 'center', // Center the icon inside the container
  },
  text: {
    fontSize: 20,
    marginLeft: width * 0.05,
    flex: 1, // Allow the text to use the remaining space
    fontFamily:theme.fonts.medium
  },
  iconStyle: {
    color: 'black',
  },
  arrowIconStyle: {
    color: 'black',
  },
});

export default SettingsItem;
