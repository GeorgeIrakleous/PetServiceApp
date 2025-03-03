import React from 'react';
import { View, Text, StyleSheet, Dimensions,Image } from 'react-native';

// Import
import MessagesButton from './MessagesButton';
import {strings} from '../utils/strings';
import {theme} from '../utils/theme';

const { width, height } = Dimensions.get('window');

const TopLogoBar = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row'}}>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/myImages/petAppLogo1.jpg')}
            style={styles.image}
          />
        </View>
        <View style={{justifyContent:'center'}}>
          <Text style={styles.title}>{strings.appTitle}</Text>
        </View>
      </View>
      <MessagesButton onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.4) / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
    marginRight:width*0.01,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container: {
    width: '100%',
    height: height * 0.065,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: width * 0.03,
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.bold
  },
});

export default TopLogoBar;
