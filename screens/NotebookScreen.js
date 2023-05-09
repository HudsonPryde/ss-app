import React, { useState, useRef } from "react";
import { Dark } from "../lib/Theme";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  LayoutAnimation,
  UIManager,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { createSetNote, getSectionNotes } from "../dao/studySets";
import { getSections, createSection } from "../dao/notebookSections";
import { useNavigation, useRoute } from "@react-navigation/native";
import NotebookSection from "../components/NotebookSection";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NotebookScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const notebookId = route.params.notebookId;
  const notebookName = route.params.notebookName;
  const notebookColour = route.params.notebookColour;
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addSectionPressed, setAddSectionPressed] = useState(false);
  const [notebookSections, setNotebookSections] = useState([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [darken, setDarken] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setNotebookSections(await getSections(notebookId));
      setIsLoading(false);
    }
    fetchData();
  }, [refresh]);

  async function handleAddNote() {
    try {
      await createSetNote(notebookId, newNoteText, "", "", "");
      setNewNoteText("");
      setRefresh(!refresh);
      setShowModal(!showModal);
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
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

  async function handleNavigateFlashcards() {
    try {
      if (!notebookSections) {
        return false;
      }
      let sectionIds = notebookSections.map(({ id }) => id);
      const notes = await getSectionNotes(sectionIds);
      console.log(notes);
      navigation.navigate("Flashcards", {
        notebookId: notebookId,
        notes: notes,
        notebookColour: notebookColour,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddSection() {
    try {
      await createSection(newSectionName, notebookId);
      setRefresh(!refresh);
      setAddSectionPressed(!addSectionPressed);
    } catch (error) {
      console.error(error);
    }
  }

  const sections = notebookSections.map((data, index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return (
      <View style={{ alignSelf: "center", marginBottom: 25 }} key={index}>
        <NotebookSection
          sectionName={data.name}
          sectionId={data.id}
          requestRefresh={() => setRefresh(!refresh)}
          requestDarken={(req) => setDarken(req)}
        />
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      {/* screen wrapper to darken when a modal is open */}
      <Animated.View
        style={{ width: "100%", height: "100%" }}
        opacity={fadeAnim}
      >
        <View style={[styles.header, { borderBottomColor: notebookColour }]}>
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
          {/* Note set header */}
          <Text numberOfLines={1} style={styles.heading}>
            {notebookName}
          </Text>
          <Pressable onPress={() => {}} style={{ marginHorizontal: 15 }}>
            <MaterialCommunityIcon
              name={"dots-horizontal-circle-outline"}
              size={22}
              color={Dark.secondary}
            />
          </Pressable>
        </View>
        <ScrollView style={{ width: "100%" }}>
          {/* Study mode buttons */}
          <View style={styles.buttonContainer}>
            {/* study flash cards */}
            <Pressable
              style={[styles.studyButton, { borderColor: notebookColour }]}
              onPress={() =>
                // navigation.navigate("Flashcards", { notebookId, studyNotes })
                handleNavigateFlashcards()
              }
            >
              <MaterialCommunityIcon
                name={"card-multiple-outline"}
                size={32}
                style={{ flex: 2, marginLeft: 10 }}
                color={Dark.primary}
              ></MaterialCommunityIcon>
              <Text
                style={[
                  styles.text,
                  {
                    textAlign: "left",
                    flex: 8,
                  },
                ]}
              >
                study flashcards
              </Text>
            </Pressable>
            {/* practice test */}
            <Pressable
              style={[styles.studyButton, { borderColor: notebookColour }]}
            >
              <MaterialCommunityIcon
                name={"school-outline"}
                size={32}
                style={{ flex: 2, marginLeft: 10 }}
                color={Dark.primary}
              ></MaterialCommunityIcon>
              <Text
                style={[
                  styles.text,
                  {
                    textAlign: "left",
                    flex: 8,
                  },
                ]}
              >
                practice test
              </Text>
            </Pressable>
          </View>
          {/* add section */}
          <Pressable
            style={[
              styles.studyButton,
              {
                padding: 3,
                width: 165,
                alignSelf: "flex-end",
                paddingHorizontal: 15,
                marginRight: 25,
                justifyContent: "space-around",
                borderColor: notebookColour,
              },
            ]}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
              );
              setAddSectionPressed(!addSectionPressed);
            }}
          >
            <MaterialCommunityIcon
              name={"folder-plus-outline"}
              size={28}
              color={Dark.primary}
            ></MaterialCommunityIcon>
            <Text
              style={[
                styles.text,
                { fontSize: 16, borderColor: notebookColour },
              ]}
            >
              add section
            </Text>
          </Pressable>
          {addSectionPressed ? (
            <View
              style={{
                alignSelf: "center",
                marginBottom: 25,
              }}
            >
              <View style={styles.sectionContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <MaterialCommunityIcon
                    name={"chevron-right"}
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
                  <TextInput
                    maxLength={20}
                    keyboardAppearance={"dark"}
                    autoFocus={true}
                    enterKeyHint={"done"}
                    returnKeyLabel={"done"}
                    returnKeyType={"done"}
                    value={newSectionName}
                    onChangeText={setNewSectionName}
                    onBlur={() => {
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.easeInEaseOut
                      );
                      setAddSectionPressed(!addSectionPressed);
                    }}
                    onSubmitEditing={handleAddSection}
                    style={[styles.text, { flex: 1, lineHeight: 25 }]}
                  ></TextInput>
                </View>
                <View>
                  <MaterialCommunityIcon
                    name={"dots-horizontal"}
                    size={22}
                    color={Dark.secondary}
                  />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <MaterialCommunityIcon
                    name={"plus"}
                    size={26}
                    color={Dark.secondary}
                  />
                </View>
              </View>
            </View>
          ) : null}
          {isLoading ? null : sections}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Dark.background,
    alignItems: "start",
    justifyContent: "start",
  },
  header: {
    paddingVertical: 20,
    backgroundColor: Dark.header,
    textAlignVertical: "center",
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#858585",
    borderBottomWidth: 2,
  },
  heading: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "600",
    textAlignVertical: "center",
    textAlign: "center",
    flex: 1,
    color: Dark.primary,
    fontSize: 24,
  },
  text: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 30,
    color: Dark.primary,
  },
  sectionContainer: {
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
  buttonContainer: {
    marginLeft: 15,
    marginTop: 25,
    marginBottom: 45,
    flexDirection: "column",
  },
  studyButton: {
    borderWidth: 2,
    borderColor: Dark.secondary,
    flexDirection: "row",
    width: "70%",
    borderRadius: 45,
    alignItems: "center",
    padding: 3,
    marginLeft: 3,
    marginBottom: 20,
  },
});

export default NotebookScreen;
