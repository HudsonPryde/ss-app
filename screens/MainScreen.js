import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { createStudySet, getStudySets } from "../dao/studySets";
import Notebook from "../components/Notebook";

const MainScreen = ({ navigation }) => {
  const searchRef = React.createRef(null);
  const screenW = Dimensions.get("screen").width;
  const screenH = Dimensions.get("screen").height;
  const [studySets, setStudySets] = useState([]);
  const [showNewSetModal, setNewSetModal] = useState(false);
  const [createSetButtonDisable, setCreateSetButtonDisable] = useState(true);
  const [newStudySetName, setNewStudySetName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const sets = await getStudySets("d4de7fa9-7bba-474f-9f05-3afcc603df4d");
      setStudySets(sets ? sets : []);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const focusInput = () => {
    searchRef.current.focus();
  };

  const noteSets = studySets.map((data, index) => {
    return (
      <View key={index}>
        <Notebook name={data.name} id={data.id} colour={data.colour} />
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Text
            style={[
              styles.text,
              {
                color: "#FFFFF0",
                fontSize: 20,
                height: 40,
                width: 40,
                flex: 1,
                textAlign: "center",
                textAlignVertical: "center",
                lineHeight: "38",
              },
            ]}
          >
            H
          </Text>
        </View>
        <Pressable style={{ flexDirection: "row" }}>
          <Text
            style={[
              styles.text,
              {
                fontSize: 16,
                color: "#FFFFF0",
                textAlignVertical: "center",
                lineHeight: "38",
                fontFamily: "PoppinsLight",
                marginLeft: 10,
              },
            ]}
          >
            hudsonpryde@gmail.com
          </Text>
          <MaterialIcon
            name={"unfold-more"}
            size={18}
            color={"#858585"}
            style={{ alignSelf: "center" }}
          />
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            alignSelf: "center",
            alignItems: "flex-end",
            marginRight: 15,
          }}
        >
          <MaterialCommunityIcon
            name={"dots-horizontal-circle-outline"}
            size={24}
            color={"#858585"}
          />
        </Pressable>
      </View>

      {/* Note set list */}
      <ScrollView style={{ width: "85%", alignSelf: "center", paddingTop: 26 }}>
        {/* search bar */}
        <Pressable onPressIn={focusInput}>
          <View style={styles.searchBar}>
            <MaterialIcon
              name={"search"}
              size={30}
              style={{ marginLeft: 10, color: "#858585" }}
            ></MaterialIcon>
            <TextInput
              ref={searchRef}
              keyboardAppearance={"dark"}
              style={{
                flex: 0.9,
                height: "85%",
                marginLeft: 10,
                borderBottomWidth: 1,
                borderColor: "#858585",
                color: "#FFFFF0",
              }}
            ></TextInput>
          </View>
        </Pressable>
        <Text style={styles.heading}>Your notebooks</Text>
        {/* note set generator */}
        {isLoading ? <ActivityIndicator size="large" color="grey" /> : noteSets}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNewSetModal}
        onRequestClose={() => {
          setNewSetModal(!showNewSetModal);
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
        >
          <View
            style={{
              flex: 1,
              alignSelf: "flex-end",
              marginRight: 25,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setCreateSetButtonDisable(true);
                setNewStudySetName("");
                setNewSetModal(!showNewSetModal);
              }}
            >
              <MaterialIcon name={"close"} size={40} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            <Text style={[styles.text, { textAlign: "center" }]}>
              what's the name of you new study set?
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
            }}
          >
            <TextInput
              style={styles.setNameInput}
              maxLength={35}
              autoFocus={true}
              onChangeText={async (text) => {
                if (text.length > 0) setCreateSetButtonDisable(false);
                else setCreateSetButtonDisable(true);
                setNewStudySetName(text);
              }}
            />
            <TouchableOpacity
              disabled={createSetButtonDisable}
              onPress={async () => {
                await createStudySet(newStudySetName, {});
                setStudySets(await getStudySets());
                setNewSetModal(!showNewSetModal);
              }}
            >
              <View
                style={{
                  backgroundColor: "#000",
                  padding: 26,
                  borderTopRightRadius: 25,
                  borderBottomRightRadius: 25,
                }}
              >
                <Text style={[styles.text, { color: "#f4f3f2" }]}>create</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 2 }}></View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    alignItems: "start",
    justifyContent: "start",
  },
  studySet: {
    padding: 15,
    margin: 10,
    marginBottom: -5,
    // flex: 0,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    flexGrow: 10,
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 2,
    gap: 11,
  },
  searchBar: {
    borderColor: "#858585",
    borderWidth: 1,
    borderRadius: 25,
    flexDirection: "row",
    alignContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 2,
    width: "100%",
    borderBottomColor: "#212121",
  },
  heading: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 35,
    marginBottom: 10,
    color: "#5E5E5E",
  },
  text: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 30,
    color: "#292727",
  },
  setNameInput: {
    borderWidth: 5,
    padding: 20,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 24,
    color: "#292727",
    width: 250,
    height: 82,
  },
  floatingButton: {
    backgroundColor: "#588fe2",
    borderRadius: 45,
    position: "absolute",
    borderWidth: 2,
  },
  icon: {
    borderWidth: 1,
    borderColor: "#858585",
    borderRadius: 5,
    alignItems: "center",
    width: 40,
    height: 40,
    marginLeft: 12,
  },
});

export default MainScreen;
