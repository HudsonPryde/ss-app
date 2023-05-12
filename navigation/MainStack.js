import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainScreen from "../screens/MainScreen";
import NotebookScreen from "../screens/NotebookScreen";
import FlashcardScreen from "../screens/FlashcardScreen";

const MainStack = createNativeStackNavigator();
const MainNav = () => {
  return (
    <MainStack.Navigator
      initialRouteName="Main"
      animation="slide_from_bottom"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <MainStack.Screen name="Main" component={MainScreen} />
      <MainStack.Screen name="Notebook" component={NotebookScreen} />
      <MainStack.Screen name="Flashcards" component={FlashcardScreen} />
    </MainStack.Navigator>
  );
};

export default MainNav;
