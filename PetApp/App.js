import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

import RootNavigator from './navigation/RootNavigator';

const loadFonts = async () => {
  await Font.loadAsync({
    // Replace 'path_to_font_file' with actual path and ensure the font names are correct
    'Hubot Sans Bold': require('./assets/fonts/Hubot Sans Bold.ttf'),
    'Hubot Sans Regular': require('./assets/fonts/Hubot Sans Regular.ttf'),
    'Hubot Sans Medium': require('./assets/fonts/Hubot Sans Medium.ttf'),
    'Hubot Sans SemiBold': require('./assets/fonts/Hubot Sans SemiBold.ttf'),
    'Hubot Sans Light': require('./assets/fonts/Hubot Sans Light.ttf'),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true)).catch(err => console.error('Error loading fonts:', err));
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <RootNavigator />;
}
