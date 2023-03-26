import React, { useState, useEffect } from "react";
import { Dark } from "../lib/Theme";
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Modal,
} from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { createSetNote, getSectionNotes } from "../dao/studySets";
import { removeSection, renameSection } from "../dao/notebookSections";
import { TextInput } from "react-native-gesture-handler";
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NotebookSection = ({ sectionName, sectionId, requestRefresh }) => {
  const [expandPressed, setExpandPressed] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showAddNotesModal, setShowAddNotesModal] = useState(false);
  const [rename, setRename] = useState(false);
  const [newSectionName, setNewSectionName] = useState(sectionName);
  const [sectionNotes, setSectionNotes] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setSectionNotes(await getSectionNotes([sectionId]));
    }
    fetchData();
  }, [refresh]);

  const handleRemoveSection = async () => {
    try {
      const res = await removeSection(sectionId);
      if (res) {
        requestRefresh();
        console.log("removed: " + sectionId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameSection = async () => {
    try {
      const res = await renameSection(sectionId, newSectionName);
      if (res) {
        requestRefresh();
        setShowOptionModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const notes = sectionNotes.map((data, index) => {
    return (
      <View key={index} style={[styles.note]}>
        <Text numberOfLines={4} style={styles.text}>
          {data.text}
        </Text>
      </View>
    );
  });

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setExpandPressed(!expandPressed);
          }}
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <MaterialCommunityIcon
            name={expandPressed ? "chevron-down" : "chevron-right"}
            size={22}
            color={Dark.secondary}
            style={{ paddingHorizontal: 15 }}
          />
          <MaterialCommunityIcon
            name={"folder-outline"}
            size={22}
            color={Dark.secondary}
            style={{ paddingRight: 5 }}
          />
          {rename ? (
            <TextInput
              maxLength={20}
              keyboardAppearance={"dark"}
              autoFocus={true}
              enterKeyHint={"done"}
              returnKeyLabel={"done"}
              returnKeyType={"done"}
              value={newSectionName}
              onChangeText={setNewSectionName}
              onBlur={() => setRename(!rename)}
              onSubmitEditing={() => handleRenameSection()}
              style={[styles.text, { flex: 1, lineHeight: 20 }]}
            ></TextInput>
          ) : (
            <Text style={styles.text}>{sectionName}</Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => {
            setShowOptionModal(!showOptionModal);
          }}
        >
          <MaterialCommunityIcon
            name={"dots-horizontal"}
            size={22}
            color={Dark.secondary}
          />
        </Pressable>
        <Pressable
          style={{ marginLeft: 10 }}
          onPress={() => setShowAddNotesModal(true)}
        >
          <MaterialCommunityIcon
            name={"plus"}
            size={26}
            color={Dark.secondary}
          />
        </Pressable>
      </View>
      {expandPressed && (
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          style={{
            marginTop: 15,
            width: 270,
            overflow: "visible",
            height: 130,
          }}
        >
          {notes}
        </ScrollView>
      )}
      {/* Section Options Modal */}
      <Modal visible={showOptionModal} animationType="slide" transparent={true}>
        <Pressable
          onPress={() => setShowOptionModal(false)}
          style={{ flex: 3 }}
        ></Pressable>
        <View style={[styles.optionsModal]}>
          <View
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
              name={"folder-open-outline"}
              size={24}
              color={Dark.primary}
            ></MaterialCommunityIcon>
            <Text style={[styles.text, { marginLeft: 15, fontSize: 20 }]}>
              {sectionName}
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            <Pressable
              style={styles.optionButton}
              onPress={() => {
                setShowOptionModal(false);
                setRename(true);
              }}
            >
              <MaterialCommunityIcon
                name={"pencil-outline"}
                size={20}
                color={Dark.primary}
              ></MaterialCommunityIcon>
              <Text style={[styles.text, { marginLeft: 15, lineHeight: 20 }]}>
                Rename
              </Text>
            </Pressable>
            <Pressable style={styles.optionButton} onPress={() => {}}>
              <MaterialCommunityIcon
                name={"text-box-multiple-outline"}
                size={20}
                color={Dark.primary}
              ></MaterialCommunityIcon>
              <Text style={[styles.text, { marginLeft: 15, lineHeight: 20 }]}>
                Notes
              </Text>
            </Pressable>
            <Pressable
              style={styles.optionButton}
              onPress={() => handleRemoveSection()}
            >
              <MaterialCommunityIcon
                name={"file-remove-outline"}
                size={20}
                color={Dark.alert}
              ></MaterialCommunityIcon>
              <Text
                style={[
                  styles.text,
                  {
                    marginLeft: 15,
                    color: Dark.alert,
                    lineHeight: 20,
                  },
                ]}
              >
                Delete
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* Section Add Notes Modal */}
      <Modal
        visible={showAddNotesModal}
        animationType="slide"
        transparent={true}
      >
        <Pressable
          onPress={() => setShowAddNotesModal(false)}
          style={{ flex: 3 }}
        ></Pressable>
        <View style={[styles.optionsModal]}>
          <View
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
              name={"folder-open-outline"}
              size={24}
              color={Dark.primary}
            ></MaterialCommunityIcon>
            <Text style={[styles.text, { marginLeft: 15, fontSize: 20 }]}>
              {sectionName}
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            <Pressable
              style={styles.optionButton}
              onPress={() => {
                setShowAddNotesModal(false);
              }}
            >
              <MaterialCommunityIcon
                name={"note-text-outline"}
                size={20}
                color={Dark.primary}
              ></MaterialCommunityIcon>
              <Text style={[styles.text, { marginLeft: 15, lineHeight: 20 }]}>
                Single
              </Text>
            </Pressable>
            <Pressable style={styles.optionButton} onPress={() => {}}>
              <MaterialCommunityIcon
                name={"image-filter-center-focus-weak"}
                size={20}
                color={Dark.primary}
              ></MaterialCommunityIcon>
              <Text style={[styles.text, { marginLeft: 15, lineHeight: 20 }]}>
                Camera
              </Text>
            </Pressable>
            <Pressable style={styles.optionButton} onPress={() => {}}>
              <MaterialCommunityIcon
                name={"image-outline"}
                size={20}
                color={Dark.primary}
              ></MaterialCommunityIcon>
              <Text
                style={[
                  styles.text,
                  {
                    marginLeft: 15,
                    lineHeight: 20,
                  },
                ]}
              >
                Library
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: Dark.secondary,
    borderBottomWidth: 1,
    padding: 5,
    gap: 5,
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    width: "90%",
  },
  optionsContainer: {
    backgroundColor: "#242424",
    borderRadius: 15,
    flexDirection: "column",
    margin: 25,
    height: 170,
    overflow: "hidden",
  },
  optionButton: {
    borderBottomWidth: 3,
    borderBottomColor: Dark.tertiary,
    padding: 15,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  optionsModal: {
    flex: 2,
    borderRadius: 15,
    backgroundColor: Dark.tertiary,
  },
  text: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 30,
    color: Dark.primary,
  },
  note: {
    width: 250,
    height: 130,
    marginLeft: 30,
    padding: 15,
    borderRadius: 15,
    backgroundColor: Dark.tertiary,
  },
});

export default NotebookSection;
