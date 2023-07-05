import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Dark } from "../lib/Theme";

const OfflineScreen = () => {
  return (
    <View style={styles.container}>
      <MaterialIcons
        name="wifi-off"
        size={100}
        color={Dark.primary}
        style={{ alignSelf: "center" }}
      />
      <Text style={styles.text}>Internet hiccup?</Text>
      <Text style={styles.secondaryText}>
        Check your connection and try again.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    flexDirection: "column",
    justifyContent: "center",
  },
  text: {
    color: Dark.primary,
    fontSize: 24,
    textAlign: "center",
  },
  secondaryText: {
    color: Dark.secondary,
    fontSize: 18,
    textAlign: "center",
  },
});

export default OfflineScreen;
