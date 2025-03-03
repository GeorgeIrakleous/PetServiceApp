import React from 'react';
import { Image, StyleSheet,View ,Dimensions, ScrollView} from 'react-native';

//import
import SERVICE_TYPES from '../utils/serviceTypes';
import ScreenTitle from '../components/ScreenTitle';
import ServiceItem from '../components/ServiceItem';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const ServicesScreen = ({handleService}) => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        <ScreenTitle title="Select a Service"/>
      </View>

      <View style={styles.scrollableContainer}>
        <View style={{marginTop:height*0.0}}>
          {SERVICE_TYPES.map((service) => (
            <TouchableOpacity key={service.id} onPress={() => handleService(service.name)}>
              <ServiceItem title={service.name} iconName={service.iconName}/>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/myImages/petsImage8.jpg')}
          style={styles.image}
        />
      </View>  
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer:{
    flex:1, 
    backgroundColor:'#D4D4C9'
  },
  container: {
    backgroundColor:'#D4D4C9',
  },
  scrollableContainer:{
    flex:1,
    backgroundColor:'#D4D4C9',
    alignItems:'center',
    justifyContent:'center'
  },
  imageContainer:{
    flex:1/3.5,
    backgroundColor: '#D4D4C9'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode:'stretch'
  },
});

export default ServicesScreen;
