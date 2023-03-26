import React from "react";
import { Pressable, View, StyleSheet, Text, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
const Notebook = ({ name, id, colour }) => {
  const navigation = useNavigation();
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
          <Pressable>
            <MaterialIcon name={"more-horiz"} size={25} color={"#D8D8D8"} />
          </Pressable>
        </View>

        <View style={styles.setCountPill}>
          <Text
            style={[
              styles.text,
              { color: "#121212", fontSize: 16, textAlign: "center" },
            ]}
          >
            8 sets
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  studySet: {
    padding: 15,
    height: 150,
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
    borderRadius: 25,
    paddingHorizontal: 10,
    width: 100,
  },
});

export default Notebook;
