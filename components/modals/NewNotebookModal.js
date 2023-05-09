import React, { useEffect, useState } from "react";
import {
  Pressable,
  View,
  StyleSheet,
  Text,
  TextInput,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { Dark, Notebook } from "../../lib/Theme";
import { createStudySet } from "../../dao/studySets";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

const NewNotebookModal = ({ userId, visible, requestClose, onConfirm }) => {
  const [showModal, setShowModal] = useState(false);
  const [notebookName, setNotebookName] = useState("");
  const [selectedColour, setSelectedColour] = useState(Notebook.grape);

  useEffect(() => {
    setShowModal(visible);
  }, [visible]);

  const handleCreateNotebook = async ({ id, name, colour }) => {
    try {
      const notebook = await createStudySet(id, name, colour);
      onConfirm(notebook);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal visible={showModal} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0)",
        }}
        behavior="padding"
      >
        <View style={styles.optionsContainer}>
          {/* name input */}
          <TextInput
            autoFocus={true}
            style={[styles.optionsText, styles.nameInput]}
            placeholder={"Notebook Name"}
            value={notebookName}
            maxLength={40}
            onChangeText={(text) => setNotebookName(text)}
          />
          {/* colour selector */}
          <View style={styles.colourSelector}>
            <Pressable
              style={styles.optionColour}
              onPress={() => setSelectedColour(Notebook.grape)}
            >
              <MaterialCommunityIcon
                name={
                  selectedColour === Notebook.grape
                    ? "square-rounded"
                    : "square-rounded-outline"
                }
                size={30}
                color={Notebook.grape}
              />
            </Pressable>
            <Pressable
              style={styles.optionColour}
              onPress={() => setSelectedColour(Notebook.cerulean)}
            >
              <MaterialCommunityIcon
                name={
                  selectedColour === Notebook.cerulean
                    ? "square-rounded"
                    : "square-rounded-outline"
                }
                size={30}
                color={Notebook.cerulean}
              />
            </Pressable>
            <Pressable
              style={styles.optionColour}
              onPress={() => setSelectedColour(Notebook.ebony)}
            >
              <MaterialCommunityIcon
                name={
                  selectedColour === Notebook.ebony
                    ? "square-rounded"
                    : "square-rounded-outline"
                }
                size={30}
                color={Notebook.ebony}
              />
            </Pressable>
            <Pressable
              style={styles.optionColour}
              onPress={() => setSelectedColour(Notebook.orange)}
            >
              <MaterialCommunityIcon
                name={
                  selectedColour === Notebook.orange
                    ? "square-rounded"
                    : "square-rounded-outline"
                }
                size={30}
                color={Notebook.orange}
              />
            </Pressable>
            <Pressable
              style={styles.optionColour}
              onPress={() => setSelectedColour(Notebook.emerald)}
            >
              <MaterialCommunityIcon
                name={
                  selectedColour === Notebook.emerald
                    ? "square-rounded"
                    : "square-rounded-outline"
                }
                size={30}
                color={Notebook.emerald}
              />
            </Pressable>
            <Pressable
              style={styles.optionColour}
              onPress={() => setSelectedColour(Notebook.red)}
            >
              <MaterialCommunityIcon
                name={
                  selectedColour === Notebook.red
                    ? "square-rounded"
                    : "square-rounded-outline"
                }
                size={30}
                color={Notebook.red}
              />
            </Pressable>
          </View>
          {/* confirmation buttons */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <Pressable
              style={styles.optionButton}
              onPress={() => {
                requestClose();
              }}
            >
              <Text style={[styles.optionsText, { color: Dark.alert }]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.optionButton,
                { borderLeftColor: Dark.tertiary, borderLeftWidth: 3 },
              ]}
              onPress={() => {
                handleCreateNotebook({
                  id: userId,
                  name: notebookName,
                  colour: selectedColour,
                });
              }}
            >
              <Text style={[styles.optionsText]}>Create</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: "flex-start",
    width: 275,
    // height: 175,
    overflow: "hidden",
  },
  colourSelector: {
    margin: 20,
    backgroundColor: Dark.tertiary,
    borderRadius: 10,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
  },
  optionColour: {
    padding: 5,
  },
  optionButton: {
    borderTopWidth: 3,
    borderTopColor: Dark.tertiary,
    padding: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  nameInput: {
    backgroundColor: Dark.tertiary,
    borderRadius: 10,
    margin: 10,
    marginBottom: 5,
    alignSelf: "center",
    width: "90%",
    padding: 10,
    fontSize: 18,
    lineHeight: 26,
  },
});

export default NewNotebookModal;
