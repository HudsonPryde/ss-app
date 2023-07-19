import React, { useEffect } from "react";
import { Dark } from "../lib/Theme";
import { Pressable, View, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useSections } from "../provider/SectionsProvider";
import { useNotebooks } from "../provider/NotebookProvider";

const Notebook = ({ id, triggerModal }) => {
  const navigation = useNavigation();
  const [sectionCount, setSectionCount] = React.useState(null);
  // retrieve notebooks from context
  const notebooks = useNotebooks();
  // retrieve sections from context
  const sections = useSections();
  const { name, colour } = notebooks.find((notebook) => notebook.id === id);

  useEffect(() => {
    // count the number of sections in the notebook
    if (!sections) return;
    const count = sections?.filter(
      (section) => section.notebook_id === id
    ).length;
    setSectionCount(count);
  }, [sections]);

  // dont render the notebook until the section count is known
  if (sectionCount === null) {
    return null;
  }

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Notebook", {
          id: id,
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
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.text, { flex: 1 }]}
          >
            {name}
          </Text>
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
