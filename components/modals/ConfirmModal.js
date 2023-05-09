import React, { useEffect, useState } from "react";
import { Pressable, View, StyleSheet, Text, Modal } from "react-native";
import { Dark } from "../../lib/Theme";

const ConfirmModal = ({
  visible,
  requestClose,
  message,
  submitLabel,
  submitColour,
  onConfirm,
}) => {
  const [showModal, setShowModal] = useState(false);

  //TODO: create onConfirm function
  //TODO: fix styling

  useEffect(() => {
    setShowModal(visible);
  }, [visible]);

  return (
    <Modal visible={showModal} animationType="slide" transparent={true}>
      <View style={styles.optionsContainer}>
        <Text style={styles.optionsText}>{message}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Pressable
            style={styles.optionButton}
            onPress={() => {
              requestClose();
            }}
          >
            <Text style={styles.optionsText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.optionButton, { backgroundColor: submitColour }]}
            onPress={() => {
              requestClose();
              onConfirm();
            }}
          >
            <Text style={styles.optionsText}>{submitLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    backgroundColor: Dark.quatrenary,
    borderRadius: 15,
    alignSelf: "center",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    margin: 25,
    height: 175,
    overflow: "hidden",
  },
  optionButton: {
    borderBottomWidth: 3,
    borderBottomColor: Dark.tertiary,
    padding: 15,
    height: "33%",
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
  },
  optionsModal: {
    flex: 2,
    borderRadius: 15,
    backgroundColor: Dark.tertiary,
  },
  optionsText: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 30,
    color: Dark.primary,
  },
});

export default ConfirmModal;
