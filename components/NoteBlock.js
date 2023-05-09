import React, { useState } from "react";
import { Dark } from "../lib/Theme";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { createSetNote } from "../dao/studySets";

const NoteBlock = (props) => {
  const [addNotePressed, setAddNotePressed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [noteText, setNoteText] = useState(props.noteText);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{noteText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    margin: 15,
    borderRadius: 15,
    backgroundColor: Dark.tertiary,
  },
  text: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 30,
    color: Dark.primary,
  },
  icon: {
    flex: 1,
    flexDirection: "row-reverse",
  },
});

export default NoteBlock;
