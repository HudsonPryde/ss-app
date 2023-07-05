import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CameraScreen from "../screens/CameraScreen";
import ScannedTextScreen from "../screens/ScannedTextScreen";
import NotesScreen from "../screens/NotesScreen";

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
      <CameraStack.Screen
        name="Camera"
        component={CameraScreen}
        initialParams={{ initText: "" }}
      />
      <CameraStack.Group screenOptions={{ presentation: "modal" }}>
        <CameraStack.Screen name="ScannedText" component={ScannedTextScreen} />
      </CameraStack.Group>
      <CameraStack.Screen name="CameraNotes" component={NotesScreen} />
    </CameraStack.Navigator>
  );
};

export default CameraNav;
