import React, { useState, useRef, useEffect } from "react";
import { Dark, Notebook } from "../../lib/Theme";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Animated,
  Pressable,
  LayoutAnimation,
  UIManager,
} from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { removeStudySet, updateStudySet } from "../../dao/studySets";
// import ConfirmModal from "./ConfirmModal";
import {
  useNotebooks,
  useNotebooksDispatch,
} from "../../provider/NotebookProvider";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NotebookOptions = ({ id, requestClose, showModal }) => {
  const notebooks = useNotebooks();
  const dispatch = useNotebooksDispatch();
  const notebook = notebooks.find((n) => n.id === id);
  const [notebookOptions, setNotebookOptions] = useState(notebook);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const notebookNameRef = useRef(null);

  useEffect(() => {
    const notebook = notebooks.find((n) => n.id === id);
    setNotebookOptions(notebook);
  }, [id]);

  const handleDeleteNotebook = async () => {
    try {
      await removeStudySet(id);
      setConfirmDelete(!confirmDelete);
      dispatch({ type: "removed", id });
      requestClose();
    } catch (error) {
      console.log(error);
    }
  };

  const changeColour = (colour) => {
    setNotebookOptions({ ...notebookOptions, colour: colour });
  };

  const handleUpdateNotebook = async () => {
    try {
      if (notebook === notebookOptions) {
        requestClose();
        return;
      }
      const { name, colour, id } = notebookOptions;
      updateStudySet(id, { name: name, colour: colour });
      dispatch({ type: "updated", notebook: notebookOptions });
      requestClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      visible={showModal}
      onRequestClose={() => handleUpdateNotebook()}
      animationType="slide"
      transparent={true}
    >
      <Pressable
        onPress={() => {
          handleUpdateNotebook();
        }}
        style={{ flex: 0.5 }}
      ></Pressable>

      <View style={[styles.optionsModal]}>
        <Pressable
          style={{ margin: 15, marginLeft: "auto", marginBottom: 0 }}
          hitSlop={30}
        >
          <MaterialCommunityIcon
            name={"close-circle"}
            size={24}
            color={Dark.secondary}
            onPress={() => handleUpdateNotebook()}
          ></MaterialCommunityIcon>
        </Pressable>
        <Pressable
          onPress={() => notebookNameRef.current.focus()}
          style={[
            styles.optionsContainer,
            {
              marginBottom: 0,
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              height: 60,
            },
          ]}
        >
          <MaterialCommunityIcon
            name={"book-variant"}
            size={24}
            color={notebookOptions ? notebookOptions.colour : Dark.primary}
          ></MaterialCommunityIcon>
          <TextInput
            returnKeyType="done"
            ref={notebookNameRef}
            onChangeText={(text) =>
              setNotebookOptions({ ...notebookOptions, name: text })
            }
            style={[
              styles.optionsText,
              {
                marginLeft: 15,
                fontSize: 20,
                color: Dark.primary,
                lineHeight: 28,
              },
            ]}
            value={notebookOptions ? notebookOptions.name : null}
          />
          <MaterialCommunityIcon
            name={"pencil-outline"}
            size={24}
            color={Dark.primary}
            style={{ marginLeft: "auto" }}
          ></MaterialCommunityIcon>
        </Pressable>

        <View style={styles.optionsContainer}>
          <Pressable
            style={[
              styles.optionButton,
              { borderRightWidth: 3, borderRightColor: Dark.tertiary },
            ]}
            onPress={() => changeColour(Notebook.grape)}
          >
            <MaterialCommunityIcon
              name={
                notebookOptions
                  ? notebookOptions.colour === Notebook.grape
                    ? "circle-slice-8"
                    : "circle-outline"
                  : null
              }
              size={24}
              color={Notebook.grape}
            ></MaterialCommunityIcon>
            <Text
              style={[styles.optionsText, { marginLeft: 15, lineHeight: 20 }]}
            >
              Purple
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.optionButton,
              {
                borderRightWidth: 3,
                borderRightColor: Dark.tertiary,
              },
            ]}
            onPress={() => changeColour(Notebook.cerulean)}
          >
            <MaterialCommunityIcon
              name={
                notebookOptions
                  ? notebookOptions.colour === Notebook.cerulean
                    ? "circle-slice-8"
                    : "circle-outline"
                  : null
              }
              size={24}
              color={Notebook.cerulean}
            ></MaterialCommunityIcon>
            <Text
              style={[
                styles.optionsText,
                {
                  marginLeft: 15,
                  lineHeight: 20,
                },
              ]}
            >
              Blue
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.optionButton,
              {
                borderBottomWidth: 0,
                borderRightWidth: 3,
                borderRightColor: Dark.tertiary,
              },
            ]}
            onPress={() => changeColour(Notebook.ebony)}
          >
            <MaterialCommunityIcon
              name={
                notebookOptions
                  ? notebookOptions.colour === Notebook.ebony
                    ? "circle-slice-8"
                    : "circle-outline"
                  : null
              }
              size={24}
              color={Notebook.ebony}
            ></MaterialCommunityIcon>
            <Text
              style={[styles.optionsText, { marginLeft: 15, lineHeight: 20 }]}
            >
              Ebony
            </Text>
          </Pressable>
          <Pressable
            style={styles.optionButton}
            onPress={() => changeColour(Notebook.orange)}
          >
            <MaterialCommunityIcon
              name={
                notebookOptions
                  ? notebookOptions.colour === Notebook.orange
                    ? "circle-slice-8"
                    : "circle-outline"
                  : null
              }
              size={24}
              color={Notebook.orange}
            ></MaterialCommunityIcon>
            <Text
              style={[
                styles.optionsText,
                {
                  marginLeft: 15,
                  lineHeight: 20,
                },
              ]}
            >
              Orange
            </Text>
          </Pressable>
          <Pressable
            style={styles.optionButton}
            onPress={() => changeColour(Notebook.emerald)}
          >
            <MaterialCommunityIcon
              name={
                notebookOptions
                  ? notebookOptions.colour === Notebook.emerald
                    ? "circle-slice-8"
                    : "circle-outline"
                  : null
              }
              size={24}
              color={Notebook.emerald}
            ></MaterialCommunityIcon>
            <Text
              style={[
                styles.optionsText,
                {
                  marginLeft: 15,
                  lineHeight: 20,
                },
              ]}
            >
              Green
            </Text>
          </Pressable>
          <Pressable
            style={[styles.optionButton, { borderBottomWidth: 0 }]}
            onPress={() => changeColour(Notebook.red)}
          >
            <MaterialCommunityIcon
              name={
                notebookOptions
                  ? notebookOptions.colour === Notebook.red
                    ? "circle-slice-8"
                    : "circle-outline"
                  : null
              }
              size={24}
              color={Notebook.red}
            ></MaterialCommunityIcon>
            <Text
              style={[
                styles.optionsText,
                {
                  marginLeft: 15,
                  lineHeight: 20,
                },
              ]}
            >
              Red
            </Text>
          </Pressable>
        </View>
        <View
          style={[
            styles.optionsContainer,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: confirmDelete ? "center" : "flex-start",
              height: confirmDelete ? 100 : 50,
              marginTop: "auto",
              marginBottom: 45,
            },
          ]}
        >
          <Pressable
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
              );
              setConfirmDelete(!confirmDelete);
            }}
            disabled={confirmDelete}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              width: confirmDelete ? "auto" : "100%",
            }}
          >
            <MaterialCommunityIcon
              name={"trash-can-outline"}
              size={22}
              color={Dark.alert}
            ></MaterialCommunityIcon>
            <Text
              style={[
                styles.optionsText,
                {
                  color: Dark.alert,
                  marginLeft: 15,
                  lineHeight: 22,
                  fontFamily: "PoppinsMedium",
                  fontSize: 18,
                },
              ]}
            >
              {confirmDelete ? "Are you sure?" : "Delete"}
            </Text>
          </Pressable>
          {confirmDelete ? (
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                borderTopColor: Dark.tertiary,
                borderTopWidth: 3,
              }}
            >
              <Pressable
                style={[
                  styles.optionButton,
                  {
                    height: 50,
                    width: "50%",
                    justifyContent: "center",
                    borderRightWidth: 3,
                    borderRightColor: Dark.tertiary,
                  },
                ]}
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut
                  );
                  setConfirmDelete(!confirmDelete);
                }}
              >
                <Text
                  style={[
                    styles.optionsText,
                    {
                      fontSize: 18,
                      lineHeight: 22,
                    },
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.optionButton,
                  { height: 50, width: "50%", justifyContent: "center" },
                ]}
                onPress={() => handleDeleteNotebook()}
              >
                <Text
                  style={[
                    styles.optionsText,
                    { fontSize: 18, lineHeight: 22, color: Dark.alert },
                  ]}
                >
                  Delete
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
      {/* <ConfirmModal
        visible={confirmModalVisible}
        requestClose={() => setConfirmModalVisible(false)}
      /> */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    backgroundColor: Dark.quatrenary,
    borderRadius: 15,
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
    borderRadius: 5,
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

export default NotebookOptions;
