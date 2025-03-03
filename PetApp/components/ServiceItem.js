import React from 'react';
import { Text,View, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

//import
import {theme} from '../utils/theme';

const { width, height } = Dimensions.get('window');

const ServiceItem = ( {title,iconName} ) => {
  return (
      <View style={styles.container}>
            <Text style={styles.text}>{title}</Text>
            <FontAwesomeIcon name={iconName} size={width * 0.07} style={styles.iconStyle} />
      </View>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    marginLeft: width * 0.03,  // Space between icon and text
    color: 'black',
  },
  container: {
    flexDirection:'row',
    height: height * 0.1,
    width: width * 0.75,
    backgroundColor: "white",
    borderWidth:3,
    borderColor:'#696969',
    marginBottom: height * 0.015,
    marginHorizontal:width*0.05,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:30,
  },
  text:{
    fontSize:25,
    fontFamily: theme.fonts.regular
  }
});

export default ServiceItem;
