import React, { useEffect } from "react";
import { Dark } from "../lib/Theme";
import { Pressable, View, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { countSections } from "../dao/studySets";
const Notebook = ({ name, id, colour, triggerModal }) => {
  const navigation = useNavigation();
  const [sectionCount, setSectionCount] = React.useState(null);

  useEffect(() => {
    async function fetchData() {
      const count = await countSections(id);
      setSectionCount(count);
    }
    fetchData();
  }, []);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Notebook", {
          notebookId: id,
          notebookName: name,
          notebookColour: colour,
        })
      }
    >
      <View style={[styles.studySet, { backgroundColor: colour }]}>
        <View
          style={{
            felx: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.text}>{name}</Text>
          <Pressable onPress={() => triggerModal(id)} hitSlop={10}>
            <MaterialIcon name={"more-horiz"} size={25} color={"#FFFFF0"} />
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            minWidth: 100,
            maxWidth: 120,
            justifyContent: "space-evenly",
          }}
        >
          <View style={styles.setCountPill}>
            <Text
              style={[
                styles.text,
                { color: "#121212", fontSize: 16, textAlign: "center" },
              ]}
            >
              {sectionCount}
            </Text>
          </View>
          <Text style={[styles.text, { fontFamily: "Poppins", fontSize: 14 }]}>
            sections
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  studySet: {
    padding: 15,
    height: 100,
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "center",
    borderRadius: 15,
  },
  text: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 18,
    color: "#FFFFF0",
  },
  setCountPill: {
    backgroundColor: "#FFFFF0",
    borderRadius: 15,
    paddingHorizontal: 10,
    maxWidth: 50,
  },
});

export default Notebook;
