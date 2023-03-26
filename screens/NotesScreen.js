import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Modal,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import NoteBlock from "../components/NoteBlock";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const NotesScreen = ({ navigation }) => {
  const notes = [
    {
      id: 1,
      text: "Lactic acid fermentation occurs in certain fungi, bacteria, and muscle cells.",
      colour: "#90f1ef",
    },
    {
      id: 2,
      text: "When human muscle cells undergo strenuous activity, there is insufficient oxygen for aerobic cellular respiration, so the cells will produce ATP through fermentation.",
      colour: "#ffef9f",
    },
  ];
  const [visible, setVisible] = useState(false);
  const notesList = notes.map((data) => {
    return (
      <NoteBlock noteText={data.text} colour={data.colour} key={data.id} />
    );
  });
  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Main")}>
            <View style={styles.returnButton}>
              <MaterialIcon name={"arrow-back"} size={25} />
              <Text style={{ fontSize: 18 }} textAlign="">
                return
              </Text>
            </View>
          </TouchableOpacity>
          <View>
            <Button title="Show Modal" onPress={() => setVisible(true)} />
            <Modal
              animationType="slide"
              transparent={true}
              visible={visible}
              height={300}
            >
              <View style={styles.modalContainer}>
                <Text>This is a modal screen</Text>
                <Button title="Close Modal" onPress={() => setVisible(false)} />
              </View>
            </Modal>
          </View>
        </View>
        {notesList}
        <StatusBar style="dark" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f3f2",
    height: "100%",
  },
  header: {
    flex: 1,
    flexDirection: "row-reverse",
  },
  returnButton: {
    backgroundColor: "#FFE7D0",
    borderRadius: 35,
    borderWidth: 2,
    borderStyle: "outset",
    borderColor: "rgba(0, 0, 0, 1)",
    padding: 10,
    marginRight: 15,
    flex: 1,
    flexDirection: "row",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 300,
  },
});

export default NotesScreen;
