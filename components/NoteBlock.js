import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  View,
  Pressable,
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { createSetNote } from "../dao/studySets";

const NoteBlock = (props) => {
  const [addNotePressed, setAddNotePressed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [noteText, setNoteText] = useState(props.noteText);
  return (
    <View style={[styles.shadow, { backgroundColor: props.colour }]}>
      <View style={styles.container}>
        <View style={styles.icon}>
          <TouchableOpacity
            onPress={() => {
              setAddNotePressed((prevAddNotePressed) => !prevAddNotePressed);
            }}
          >
            <View style={{ paddingLeft: 5, paddingRight: 5 }}>
              <MaterialIcon
                name={addNotePressed ? "library-add-check" : "library-add"}
                size={30}
              />
            </View>
          </TouchableOpacity>

          {/* edit button */}
          {/* <TouchableOpacity onPress={() => setNoteEdit((prevNoteEdit) => true)}>
            <View style={{ paddingLeft: 5, paddingRight: 5 }}>
              <MaterialIcon name="edit" size={30} />
            </View>
          </TouchableOpacity> */}
        </View>

        <TextInput
          style={styles.text}
          multiline={true}
          onChangeText={(newText) => {
            setNoteText(newText);
          }}
          value={noteText}
        ></TextInput>
        <StatusBar style="dark" />
      </View>
      {/* add note to study set */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
      >
        <BlurView
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: "column",
            height: "50%",
            marginTop: 50,
          }}
          intensity={60}
          tint={"light"}
        ></BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFE7D0",
    borderRadius: 38,
    paddingTop: 15,
    padding: 25,
    marginTop: -4,
    marginRight: -4,
    borderWidth: 2,
    borderStyle: "outset",
    borderColor: "rgba(0, 0, 0, 1)",
    backfaceVisibility: "visible",
  },
  shadow: {
    borderWidth: 2,
    borderRadius: 38,
    borderTopLeftRadius: 45,
    borderBottomRightRadius: 45,
    borderStyle: "outset",
    borderColor: "rgba(0, 0, 0, 1)",
    margin: 15,
    paddingLeft: 5,
    paddingBottom: 5,
  },
  text: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 30,

    color: "#292727",
  },
  icon: {
    flex: 1,
    flexDirection: "row-reverse",
  },
});

export default NoteBlock;
