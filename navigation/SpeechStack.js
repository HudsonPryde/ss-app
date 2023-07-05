import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AudioScreen from "../screens/AudioScreen";
import SpeechTextEditScreen from "../screens/SpeechTextEditScreen";
import NotesScreen from "../screens/NotesScreen";

const SpeechStack = createNativeStackNavigator();
const SpeechNav = () => {
  return (
    <SpeechStack.Navigator
      initialRouteName="Audio"
      animation="slide_from_bottom"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <SpeechStack.Screen
        name="Audio"
        component={AudioScreen}
        initialParams={{ initText: "" }}
      />
      <SpeechStack.Group screenOptions={{ presentation: "modal" }}>
        <SpeechStack.Screen
          name="TextEdit"
          component={SpeechTextEditScreen}
          options={{ gestureEnabled: false }}
        />
      </SpeechStack.Group>
    </SpeechStack.Navigator>
  );
};

export default SpeechNav;
