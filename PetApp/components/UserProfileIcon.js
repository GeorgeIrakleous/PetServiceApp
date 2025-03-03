import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const UserProfileIcon = ({ size }) => {
  const circleSize = size || width * 0.35; // Default to width * 0.35 if size isn't provided
  const userSize = size ? size * 0.68 : width * 0.24; // Scale user icon relative to circle size or default

  return (
    <View style={[styles.iconContainer]}>
      <FontAwesomeIcon name="circle" size={circleSize} color="grey" style />
      <FontAwesomeIcon name="user" size={userSize} color="white" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
  },
});

export default UserProfileIcon;
