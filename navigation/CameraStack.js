import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import NotesScreen from "../screens/NotesScreen";
import CameraScreen from "../screens/CameraScreen";

const CameraStack = createNativeStackNavigator();
const CameraNav = () => {
  return (
    <CameraStack.Navigator
      initialRouteName="Camera"
      animation="slide_from_bottom"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <CameraStack.Screen name="Camera" component={CameraScreen} />
      <CameraStack.Screen name="Notes" component={NotesScreen} />
    </CameraStack.Navigator>
  );
};

export default CameraNav;
