import { React, useState } from "react";
import { Dark } from "../../lib/Theme";
import {
  Pressable,
  View,
  StyleSheet,
  TextInput,
  Modal,
  Text,
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
const RenameModal = ({ showRenameModal, requestClose }) => {
  const [newName, setNewName] = useState("");
  return (
    <Modal
      visible={showRenameModal}
      animationType="slide"
      transparent={true}
      style={{ flexDirection: "column" }}
    >
      <View style={{ flex: 2 }}></View>
      <View style={styles.confirmBox}>
        <TextInput
          style={[styles.text, styles.input]}
          placeholder="Enter a new name"
          value={newName}
          onChangeText={(text) => setNewName(text)}
        ></TextInput>
        <View style={styles.buttons}>
          <Pressable onPress={requestClose}>
            <Text style={[styles.text, { color: Dark.alert }]}>Cancel</Text>
          </Pressable>
        </View>
      </View>
      <View style={{ flex: 3 }}></View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 18,
    color: Dark.primary,
  },
  confirmBox: {
    backgroundColor: Dark.tertiary,
    borderRadius: 15,
    padding: 25,
    alignSelf: "center",
    flex: 0,
  },
  input: {},
  buttons: {
    margin: 15,
    backgroundColor: "#242424",
    borderRadius: 15,
    padding: 5,
  },
});

export default RenameModal;
