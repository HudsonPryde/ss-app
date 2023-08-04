import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainScreen from "../screens/MainScreen";
import NotebookScreen from "../screens/NotebookScreen";
import FlashcardScreen from "../screens/FlashcardScreen";
import FlashcardOptionsScreen from "../screens/FlashcardOptionsScreen";
import FlashcardsResultsScreen from "../screens/FlashcardsResultsScreen";
import SectionNotesScreen from "../screens/SectionNotesScreen";
import NotesScreen from "../screens/NotesScreen";

const MainStack = createNativeStackNavigator();
const MainNav = () => {
  return (
    <MainStack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <MainStack.Screen name="Main" component={MainScreen} />
      <MainStack.Screen
        name="Notebook"
        component={NotebookScreen}
        options={{ lazy: false }}
      />
      <MainStack.Screen name="SectionNotes" component={SectionNotesScreen} />
      <MainStack.Screen
        name="Flashcards"
        component={FlashcardScreen}
        options={{ animationTypeForReplace: "pop" }}
      />
      <MainStack.Screen
        name="FlashcardsResults"
        component={FlashcardsResultsScreen}
        options={{
          animation: "slide_from_right",
          animationTypeForReplace: "push",
        }}
      />
      <MainStack.Group screenOptions={{ presentation: "modal" }}>
        <MainStack.Screen
          name="FlashcardOptions"
          component={FlashcardOptionsScreen}
        />
      </MainStack.Group>
      <MainStack.Screen name="Notes" component={NotesScreen} />
    </MainStack.Navigator>
  );
};

export default MainNav;
