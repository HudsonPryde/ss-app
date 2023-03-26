import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
const ShadowContainer = ({
  height,
  width,
  padding = 0,
  lm = 0,
  rm = 0,
  um = 0,
  dm = 0,
  shadowMB,
}) => {
  return (
    <View
      style={{
        flex: 1,
        width: width,
        height: height,
        marginBottom: 15,
      }}
    >
      <View
        style={[
          styles.shadow,
          {
            top: 15,
            left: 5,
            marginRight: 25,
            backgroundColor: "#C3FCF2",
            width: width * 0.95,
            height: 145,
            position: "absolute",
          },
        ]}
      ></View>
      <View style={styles.studySet}>
        <Text style={styles.text}>{props.name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  studySet: {
    padding: 15,
    margin: 10,
    marginBottom: -5,
    // flex: 0,
    flexDirection: "row",
    alignContent: "center",
    // alignItems: "center",
    flexGrow: 10,
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 2,
  },
  text: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 36,
    lineHeight: 42,
    color: "#292727",
  },
  shadow: {
    padding: 30,
    backgroundColor: "#FCC3C3",
    borderRadius: 25,
    // marginRight: 15,
    // marginLeft: 25,
    marginBottom: -95,
    borderStyle: "solid",
    borderWidth: 2,
  },
});

export default ShadowContainer;
