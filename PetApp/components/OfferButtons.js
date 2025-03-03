import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

//import
import { colors } from '../utils/colors';
import {theme} from '../utils/theme';

const { width, height } = Dimensions.get('window');

const OfferButtons = ({ chatDetails, userId, onAccept, onDecline }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  if (!chatDetails || !userId) return null;

  // Determine if the current user is the sitter or requester
  const isRequester = chatDetails.participants.find(p => p.role === 'service requester')?.user === userId;
  const isSitter = chatDetails.participants.find(p => p.role === 'sitter')?.user === userId;

  // Decide which field to check for the handshake icon
  const agreedByUser = isRequester
    ? chatDetails.agreedByRequester
    : chatDetails.agreedBySitter;

  // Determine handshake icon color
  const handshakeColor = agreedByUser ? colors.green : colors.grey;

  // Show confirmation modal
  const handleDeclineConfirmation = () => {
    setModalVisible(true);
  };

  const handleDecline = () => {
    setModalVisible(false);
    onDecline();
  };

  return (
    <>
      <View style={styles.buttonContainer}>
        {/* Decline Button */}
        <View style={styles.buttonWithLabel}>
          <Text style={styles.buttonLabel}>Decline Offer</Text>
          <TouchableOpacity onPress={handleDeclineConfirmation} style={[styles.button, styles.declineButton]}>
            <FontAwesome5 name="trash-alt" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Accept/Undo Button */}
        <View style={styles.buttonWithLabel}>
          <Text style={styles.buttonLabel}>Accept Offer</Text>
          <TouchableOpacity onPress={onAccept} style={[styles.button, styles.acceptButton]}>
            <FontAwesome5 name="handshake" size={24} color={handshakeColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal transparent={true} visible={isModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to decline this offer? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.declineButton]}
                onPress={handleDecline}
              >
                <Text style={styles.declineText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey,
    marginTop: 10,
    marginBottom: height * 0.02,
  },
  buttonWithLabel: {
    alignItems: 'center',
    flex: 1,
  },
  buttonLabel: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 5,
    fontFamily:theme.fonts.medium
  },
  button: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  acceptButton: {
    backgroundColor: colors.lightGrey,
  },
  declineButton: {
    backgroundColor: colors.tomato,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    width: width * 0.8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily:theme.fonts.regular
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.green, // Green for cancel
  },
  declineButton: {
    backgroundColor: colors.darkTomato, // Dark tomato for decline
  },
  cancelText: {
    color: colors.white,
    fontFamily:theme.fonts.medium
  },
  declineText: {
    color: colors.white,
    fontFamily:theme.fonts.medium
  },
});

export default OfferButtons;
