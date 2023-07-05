import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import Animated, {
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import {
  removeSection,
  getSections,
  createSection,
} from "../dao/notebookSections";
import { useNavigation, useRoute } from "@react-navigation/native";
import NotebookSection from "../components/NotebookSection";
import { useNotebooks } from "../provider/NotebookProvider";
import { useSections, useSectionsDispatch } from "../provider/SectionsProvider";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NotebookScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const id = route.params.id;
  const notebooks = useNotebooks();
  const dispatch = useSectionsDispatch();
  // get sections of the notebook from context
  const sections = useSections();
  const [notebookSections, setNotebookSections] = useState([]);
  const { name, colour } = notebooks.find((notebook) => notebook.id === id);
  const [addSectionPressed, setAddSectionPressed] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [darken, setDarken] = useState(false);
  const fadeAnim = useSharedValue(1);

  useEffect(() => {
    if (darken) {
      fadeAnim.value = withTiming(0.5, { duration: 200 });
    } else {
      fadeAnim.value = withTiming(1, { duration: 200 });
    }
  }, [darken]);

  const darkenStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  async function handleAddSection() {
    try {
      const section = await createSection(newSectionName, id);
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      dispatch({ type: "added", ...section });
      setAddSectionPressed(!addSectionPressed);
      setNewSectionName("");
    } catch (error) {
      console.error(error);
    }
  }

  const newSectionComponent = (
    <View
      style={{
        alignSelf: "center",
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
          <MaterialIcons
            name={"folder-outline"}
            size={28}
            color={Dark.secondary}
            style={{ paddingHorizontal: 15 }}
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
              setDarken(false);
              setAddSectionPressed(false);
              setNewSectionName("");
            }}
            onSubmitEditing={handleAddSection}
            style={[styles.text, { flex: 1, lineHeight: 25, fontSize: 16 }]}
          ></TextInput>
        </View>
        <View>
          <MaterialIcons
            name={"dots-horizontal"}
            size={22}
            color={Dark.secondary}
          />
        </View>
      </View>
    </View>
  );

  const notebookSection = (data) => {
    return (
      <Animated.View
        key={data.id}
        layout={Layout.easing()}
        // entering={SlideInRight}
        exiting={SlideOutRight}
      >
        <View
          style={[
            {
              alignSelf: "center",
            },
            { borderBottomColor: Dark.secondary, borderBottomWidth: 1 },
          ]}
        >
          <NotebookSection
            section={data}
            requestDarken={(req) => setDarken(req)}
          />
        </View>
      </Animated.View>
    );
  };

  useEffect(() => {
    // get sections of the notebook from context
    const render = sections
      ?.filter((s) => s.notebook_id === id)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    // construct an array of section components from the render list
    // when updating the list of components, we want to keep the ones that are already rendered
    // the goal of this is to not re-render the entire list and trigger a layout animation
    // create a copy of the current list of components
    const current = [...notebookSections];
    // add everything that is in the render list but not in the current list
    render.forEach((r) => {
      if (!current.find((c) => c.key === r.id)) {
        current.splice(0, 0, notebookSection(r));
      }
    });
    // remove everything that is in the current list but not in the render list
    current.forEach((c) => {
      if (!render.find((r) => r.id === c.key)) {
        current.splice(current.indexOf(c), 1);
      }
    });
    // set the new list of components ordered by date added
    setNotebookSections(current);
  }, [sections]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      {/* screen wrapper to darken when a modal is open */}
      <Animated.View style={[darkenStyle, { width: "100%", height: "100%" }]}>
        <View style={[styles.header, { borderBottomColor: colour }]}>
          {/* back button */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ marginHorizontal: 10 }}
          >
            <MaterialIcons
              name={"chevron-left"}
              size={42}
              color={Dark.secondary}
            ></MaterialIcons>
          </Pressable>
          {/* Note set header */}
          <Text numberOfLines={1} style={styles.heading}>
            {name}
          </Text>
        </View>
        <Animated.ScrollView style={{ width: "100%" }}>
          {/* Study mode buttons */}
          <View style={styles.buttonContainer}>
            {/* study flash cards */}
            <Pressable
              style={[
                styles.studyButton,
                {
                  backgroundColor: Dark.tertiary,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: Dark.quatrenary,
                },
              ]}
              onPress={() =>
                navigation.navigate("FlashcardOptions", {
                  sections: sections.filter((s) => s.notebook_id === id),
                  notebook: {
                    id: id,
                    name: name,
                    colour: colour,
                  },
                })
              }
            >
              <Text
                style={[
                  styles.text,
                  {
                    textAlign: "center",
                    fontSize: 22,
                    flex: 8,
                    fontFamily: "PoppinsRegular",
                    color: Dark.primary,
                    opacity: 0.95,
                  },
                ]}
              >
                Study flashcards
              </Text>
            </Pressable>
          </View>
          {/* add section */}
          <Pressable
            style={[
              styles.studyButton,
              {
                marginRight: 15,
                marginBottom: 0,
                width: 135,
                alignSelf: "flex-end",
                justifyContent: "space-around",
              },
            ]}
            onPress={() => {
              setAddSectionPressed(!addSectionPressed);
            }}
          >
            <MaterialIcons name={"add"} size={22} color={Dark.secondary} />
            <Text
              style={[styles.text, { fontSize: 16, color: Dark.secondary }]}
            >
              Add section
            </Text>
          </Pressable>
          {/*conditionally render "fake" section with text input if add section button is pressed*/}
          {addSectionPressed ? newSectionComponent : null}
          {notebookSections}
        </Animated.ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Dark.background,
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
    paddingVertical: 15,
    gap: 5,
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    width: "90%",
  },
  buttonContainer: {
    justifyContent: "center",
    marginHorizontal: 15,
    marginTop: 25,
    marginBottom: 45,
    flexDirection: "row",
  },
  studyButton: {
    flexDirection: "row",
    width: "70%",
    borderRadius: 15,
    alignItems: "center",
    padding: 3,
    marginLeft: 3,
    marginBottom: 20,
  },
});

export default NotebookScreen;
