import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Dark } from "../lib/Theme";

const LoadingScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color={Dark.primary} />
    </View>
  );
};

export default LoadingScreen;
