import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, Image, ActivityIndicator, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import components
import { colors } from '../utils/colors';
import UserProfileIcon from '../components/UserProfileIcon';
import SettingsItem from '../components/SettingsItem';
import {theme} from '../utils/theme';
import { strings } from '../utils/strings';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation, onSignOut, userData, setUserData }) => {
  // Function to fetch updated user data
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${strings.baseURL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data); // Update the userData state
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data.');
    }
  };

  // Use useFocusEffect to fetch data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserData(); // Fetch user data whenever the screen is focused
    }, [])
  );

  const handleBecomeSitterButton = () => {
    if (userData.sitter === false) {
      navigation.navigate('BecomeSitterScreen');
    } else {
      Alert.alert('Already a Sitter', 'You are already registered as a sitter.', [
        { text: 'OK' },
      ]);
    }
  };

  const handleReviewButton = () => {
    navigation.navigate('Review');
  };

  // Handle loading state while fetching user data
  if (!userData) {
    return (
      <View style={[styles.centeredContainer]}>
        <ActivityIndicator size={36} color={colors.darkerGrey} />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.userPhotoContainer}>
        <View style={{ flex: 3 / 7 }} marginTop={height * 0.03}>
          <UserProfileIcon />
        </View>

        <View style={{ flex: 1 / 2, marginTop: height * 0.05 }}>
          <Text style={[styles.textStyle, { alignSelf: 'center' }]}>{userData.username}</Text>
          <TouchableOpacity style={styles.editProfileButton}>
            <View style={styles.editProfileContent}>
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
              <FontAwesomeIcon name="pencil" size={width * 0.07} style={styles.editProfileIcon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingsContainer}>
        <SettingsItem title={'Settings'} iconName={'gear'} />
        <SettingsItem title={'Become a sitter'} iconName={'heart'} fun={handleBecomeSitterButton} />
        <SettingsItem
          title={'Ratings and Reviews'}
          iconName={'comments'}
          fun={handleReviewButton}
          textStyle={{ fontSize: 16 }}
        />
        <SettingsItem title={'Log Out'} iconName={'sign-out'} fun={onSignOut} />
      </View>

      <View style={styles.imageContainer}>
        <Image source={require('../assets/myImages/petsImage4.jpg')} style={styles.image} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.profileBackgroundColor,
  },
  editProfileContent: {
    flexDirection: 'row', // Layout for icon + text
    alignItems: 'center', // Align icon and text vertically
  },
  editProfileIcon: {
    marginLeft: width * 0.03, // Space between icon and text
    color: 'black',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.profileBackgroundColor,
  },
  editProfileButton: {
    backgroundColor: 'white',
    borderRadius: 30,
    borderColor: colors.darkerGrey,
    borderWidth: 3,
    alignSelf: 'center',
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.05,
  },
  editProfileButtonText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily:theme.fonts.medium
  },
  settingItems: {
    marginLeft: width * 0.03,
  },
  userPhotoContainer: {
    flexDirection: 'row',
    flex: 1 / 3,
    backgroundColor: colors.profileBackgroundColor,
    alignItems: 'center',
  },
  settingsContainer: {
    marginTop: height * 0.02,
    flex: 3 / 4,
    backgroundColor: colors.profileBackgroundColor,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 30,
    alignSelf: 'flex-start',
    fontFamily:theme.fonts.medium
  },
  imageContainer: {
    flex: 2 / 5,
    backgroundColor: colors.profileBackgroundColor,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'flex',
  },
});

export default ProfileScreen;
