import React, { useState, useRef, useEffect } from "react";
import { Dark } from "../lib/Theme";
import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  LayoutAnimation,
  UIManager,
  Animated,
} from "react-native";
import NoteBlock from "../components/NoteBlock";
import NewNotebookModal from "../components/modals/NewNotebookModal";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { getStudySets, createStudySet } from "../dao/studySets";
import { getSections, createSection } from "../dao/notebookSections";
import { createNotes } from "../dao/notes";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NotesScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [studySets, setStudySets] = useState([]);
  const [sections, setSections] = useState([]);
  const notes = [
    {
      text: "Lactic acid fermentation occurs in certain fungi, bacteria, and muscle cells.",
      question: "Where are some places that lactic acid fermentation occurs?",
      answer: "Certain fungi, bacteria, and muscle cells.",
    },
    {
      text: "When human muscle cells undergo strenuous activity, there is insufficient oxygen for aerobic cellular respiration, so the cells will produce ATP through fermentation.",
      question: "Why do human muscle cells undergo lactic acid fermentation?",
      answer:
        "To produce ATP when there is insufficient oxygen for aerobic cellular respiration.",
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [showNewNotebookModal, setShowNewNotebookModal] = useState(false);
  const [showSelectSectionModal, setShowSelectSectionModal] = useState(false);
  const [showNewSectionModal, setShowNewSectionModal] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [emitCreateNotebook, setEmitCreateNotebook] = useState(false);
  const [emitRefresh, setEmitRefresh] = useState(false);
  const [darken, setDarken] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // get notebooks
  useEffect(() => {
    async function fetchData() {
      const sets = await getStudySets(user.id);
      setStudySets(sets ? sets : []);
    }
    fetchData();
  }, [emitRefresh]);

  // get notebook sections
  useEffect(() => {
    async function fetchData() {
      const sects = selectedNotebook
        ? await getSections(selectedNotebook.id)
        : null;
      setSections(sects ? sects : []);
    }
    fetchData();
  }, [emitRefresh]);

  useEffect(() => {
    if (darken) {
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [darken]);

  // create new section and add notes to it
  const handleAddToNewSection = async (notes) => {
    try {
      const section = await createSection(newSectionName, selectedNotebook.id);
      // assign notes to section
      const sectionNotes = notes.map((note) => {
        note.section_id = section.id;
        return note;
      });
      await createNotes(sectionNotes);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  // add notes to existing section
  const handleAddToExistingSection = async (notes, section) => {
    try {
      // assign notes to section
      const sectionNotes = notes.map((note) => {
        note.section_id = section.id;
        return note;
      });
      await createNotes(sectionNotes);
      setDarken(false);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  const notesList = notes.map((data, index) => {
    return <NoteBlock noteText={data.text} key={index} />;
  });

  const notebooks = studySets.map((data, index) => {
    return (
      <Pressable
        key={index}
        onPress={() => {
          setSelectedNotebook(data);
          setEmitRefresh(!emitRefresh);
          setDarken(false);
          setShowModal(false);
        }}
        style={[
          styles.optionsContainer,
          {
            marginBottom: 0,
            marginTop: 10,
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
          color={data.colour}
        ></MaterialCommunityIcon>
        <Text style={[styles.text, { marginLeft: 15, fontSize: 20 }]}>
          {data.name}
        </Text>
      </Pressable>
    );
  });

  const notebookSections = sections.map((data, index) => {
    return (
      <Pressable
        key={index}
        onPress={() => {
          handleAddToExistingSection(notes, data);
        }}
        style={[
          styles.optionsContainer,
          {
            margin: 0,
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
            borderTopWidth: 2,
            borderTopColor: Dark.tertiary,
            borderRadius: 0,
          },
        ]}
      >
        <MaterialCommunityIcon
          name={"folder"}
          size={22}
          color={Dark.secondary}
        ></MaterialCommunityIcon>
        <Text style={[styles.text, { marginLeft: 15, fontSize: 18 }]}>
          {data.name}
        </Text>
      </Pressable>
    );
  });

  return (
    <SafeAreaView
      style={{
        backgroundColor: Dark.background,
        borderRadius: 25,
      }}
    >
      <Animated.View
        style={{ width: "100%", height: "100%" }}
        opacity={fadeAnim}
      >
        <View style={styles.header}>
          {/* back button */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ marginHorizontal: 10 }}
          >
            <MaterialCommunityIcon
              name={"chevron-left"}
              size={42}
              color={Dark.secondary}
            ></MaterialCommunityIcon>
          </Pressable>
          {/* label for Notebook to add notes to */}
          <Pressable
            style={{
              alignSelf: "center",
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => {
              // LayoutAnimation.configureNext(
              //   LayoutAnimation.Presets.easeInEaseOut
              // );
              setDarken(true);
              setShowModal(true);
            }}
          >
            <Text
              style={[
                styles.text,
                { fontSize: 20, color: Dark.primary, maxWidth: 200 },
              ]}
            >
              {selectedNotebook ? selectedNotebook.name : "select notebook..."}
            </Text>
            <MaterialCommunityIcon
              name={showModal ? "chevron-right" : "chevron-down"}
              size={18}
              color={Dark.secondary}
            ></MaterialCommunityIcon>
          </Pressable>
          {/* add notes button */}
          <Pressable
            style={{
              flex: 1,
              flexDirection: "row-reverse",
              alignSelf: "center",
              marginLeft: 20,
            }}
            onPress={() => {
              setDarken(true);
              setShowSelectSectionModal(true);
            }}
            disabled={selectedNotebook === null}
          >
            <MaterialIcon
              name={"add"}
              size={38}
              color={Dark.secondary}
            ></MaterialIcon>
          </Pressable>
        </View>
        <View style={styles.container}>
          <ScrollView>{notesList}</ScrollView>
        </View>

        {/* choose notebook modal */}
        <Modal visible={showModal} animationType="slide" transparent={true}>
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={() => {
                setDarken(false);
                setShowModal(false);
              }}
              style={{ flex: 2 }}
            ></Pressable>
            <View style={[styles.optionsModal]}>
              <ScrollView bounces={false}>
                <Pressable
                  onPress={() => {
                    setShowModal(false);
                    setShowNewNotebookModal(true);
                  }}
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
                    name={"plus"}
                    size={24}
                    color={Dark.secondary}
                  ></MaterialCommunityIcon>
                  <Text style={[styles.text, { marginLeft: 15, fontSize: 20 }]}>
                    New notebook
                  </Text>
                </Pressable>
                {notebooks}
              </ScrollView>
            </View>
          </View>
        </Modal>
        {/* add new notebook modal */}
        <NewNotebookModal
          userId={user.id}
          visible={showNewNotebookModal}
          requestClose={() => {
            setDarken(false);
            setShowNewNotebookModal(false);
          }}
          onConfirm={(notebook) => {
            setSelectedNotebook(notebook);
            setEmitRefresh(!emitRefresh);
            setDarken(false);
            setShowNewNotebookModal(false);
          }}
        />

        {/* add notes to section modal */}
        <Modal
          visible={showSelectSectionModal}
          animationType="slide"
          transparent={true}
        >
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={() => {
                setDarken(false);
                setShowSelectSectionModal(false);
              }}
              style={{ flex: 1 }}
            ></Pressable>
            <View style={[styles.optionsModal]}>
              <ScrollView bounces={false}>
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
                    name={"book-variant"}
                    size={26}
                    color={
                      selectedNotebook
                        ? selectedNotebook.colour
                        : Dark.secondary
                    }
                  ></MaterialCommunityIcon>
                  <Text style={[styles.text, { marginLeft: 15, fontSize: 22 }]}>
                    {selectedNotebook
                      ? selectedNotebook.name
                      : "select notebook..."}
                  </Text>
                </View>
                <View style={[styles.optionsContainer]}>
                  <Pressable
                    onPress={() => {
                      setShowSelectSectionModal(false);
                      setShowNewSectionModal(true);
                    }}
                    style={[
                      styles.optionsContainer,
                      {
                        margin: 0,
                        flexDirection: "row",
                        alignItems: "center",
                        borderRadius: 0,
                        padding: 15,
                      },
                    ]}
                  >
                    <MaterialCommunityIcon
                      name={"plus"}
                      size={24}
                      color={Dark.secondary}
                    ></MaterialCommunityIcon>
                    <Text
                      style={[styles.text, { marginLeft: 15, fontSize: 18 }]}
                    >
                      New section
                    </Text>
                  </Pressable>
                  {notebookSections}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* add notes to new section modal */}
        <Modal
          visible={showNewSectionModal}
          animationType="fade"
          transparent={true}
        >
          <KeyboardAvoidingView
            style={[styles.newNotebookModal]}
            behavior={"padding"}
          >
            <View style={[styles.newNotebookContainer]}>
              <TextInput
                autoFocus={true}
                value={newSectionName}
                onChangeText={(text) => setNewSectionName(text)}
                style={{
                  alignSelf: "center",
                  padding: 10,
                  margin: 15,
                  width: 225,
                  backgroundColor: Dark.background,
                  color: Dark.primary,
                  fontSize: 20,
                  borderRadius: 10,
                  fontFamily: "PoppinsRegular",
                }}
              ></TextInput>
              {/* confirmation buttons */}
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <Pressable
                  style={styles.optionButton}
                  onPress={() => {
                    setNewSectionName("");
                    setDarken(false);
                    setShowNewSectionModal(false);
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
                    handleAddToNewSection(notes);
                  }}
                >
                  <Text style={[styles.optionsText]}>Create</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Dark.background,
    height: "100%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: Dark.header,
    textAlignVertical: "center",
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: Dark.tertiary,
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  optionsModal: {
    flex: 2,
    borderRadius: 15,
    backgroundColor: Dark.tertiary,
  },
  optionsContainer: {
    backgroundColor: "#242424",
    borderRadius: 15,
    flexDirection: "column",
    margin: 25,
    overflow: "hidden",
  },
  optionsText: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 30,
    color: Dark.primary,
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
  text: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 30,
    color: Dark.primary,
  },
  newNotebookModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  newNotebookContainer: {
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
});

export default NotesScreen;
