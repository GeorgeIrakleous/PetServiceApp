// components/PetItem.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, Image, View } from 'react-native';
import { colors } from '../utils/colors';

const { width, height } = Dimensions.get('window');

// Import icons
import dogIcon from '../assets/myImages/dog_icon.png';
import catIcon from '../assets/myImages/cat_icon.png';
import {theme} from '../utils/theme';

const PetItem = ({ pet, isSelected, onSelect }) => {
  const petIcon = pet.typeOfPet === 'Dog' ? dogIcon : catIcon;

  return (
    <TouchableOpacity
      style={[styles.petItem, isSelected ? styles.selectedPetItem : styles.unselectedPetItem]}
      onPress={() => onSelect(pet._id)}
    >
      <View style={styles.contentContainer}>
        <View >
            <Image source={petIcon} style={[styles.icon, isSelected ? styles.selectedIcon : styles.unselectedIcon]} />
        </View>
        <View style={{flexDirection:'row'}}>
            <View style={[styles.textContainer,isSelected? styles.textContainerSelected:null]}>
                <Text style={[styles.petItemText, isSelected ? styles.selectedText : styles.unselectedText]}>
                    {pet.name}
                </Text>
            </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer:{
    borderRadius:10,
    alignItems:'center',
    backgroundColor: colors.tomato,
    width:width*0.35,
  },
  petItem: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: height * 0.03,
    borderColor: colors.darkerGrey,
    borderWidth: 2,
    alignItems: 'center',
  },
  selectedPetItem: {
    backgroundColor:colors.tomato
  },
  unselectedPetItem: {
    backgroundColor: colors.lightGrey,
    borderColor: colors.grey,
  },
  contentContainer: {
    height:height*0.1,
    width:width*0.35,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: height * 0.14,
  },
  icon: {
    width: width * 0.2,
    resizeMode: 'contain',
    marginBottom: height * 0.01,
  },
  selectedIcon: {
    opacity: 1, // Full visibility for selected icon
  },
  unselectedIcon: {
    opacity: 0.6, // Dimmed for unselected icon
  },
  textContainer: {
    flex:1,
    backgroundColor: colors.white,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainerSelected:{
    borderColor: colors.black
  },
  petItemText: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily:theme.fonts.medium
  },
  selectedText: {
    color: colors.black,
  },
  unselectedText: {
    color: colors.darkGrey,
  },
});

export default PetItem;
