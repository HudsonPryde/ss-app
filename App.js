import { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { StyleSheet, View, Pressable } from "react-native";
import NotesScreen from "./screens/NotesScreen";
import CameraScreen from "./screens/CameraScreen";
import MainScreen from "./screens/MainScreen";
import NotebookScreen from "./screens/NotebookScreen";
import LoginScreen from "./screens/LoginScreen";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FlashcardScreen from "./screens/FlashcardScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as SplashScreen from "expo-splash-screen";

const HomeStack = createNativeStackNavigator();
const NotesStack = createNativeStackNavigator();

const CameraScreenStack = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Camera"
      animation="slide_from_bottom"
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="Camera" component={CameraScreen} />
    </HomeStack.Navigator>
  );
};

const MainScreenStack = () => {
  return (
    <NotesStack.Navigator
      initialRouteName="Main"
      animation="slide_from_bottom"
      screenOptions={{
        headerShown: false,
      }}
    >
      <NotesStack.Screen name="Login" component={LoginScreen} />
      <NotesStack.Screen name="Main" component={MainScreen} />
      <NotesStack.Screen name="Notes" component={NotesScreen} />
      <NotesStack.Screen name="Notebook" component={NotebookScreen} />
      <NotesStack.Screen name="Flashcards" component={FlashcardScreen} />
    </NotesStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins: require("./assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsRegular: require("./assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("./assets/fonts/Poppins-Medium.ttf"),
    PoppinsBold: require("./assets/fonts/Poppins-Bold.ttf"),
    PoppinsLight: require("./assets/fonts/Poppins-Light.ttf"),
  });
  const transitionConfig = {
    animation: "slide_from_left",
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer onLayout={onLayoutRootView}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconName;
            let iconColor = focused ? "#D1D1D1" : "#858585";
            if (route.name === "CameraTab") {
              iconName = "image-filter-center-focus-weak";
            } else if (route.name === "MainTab") {
              iconName = "format-list-bulleted";
            }
            return (
              <MaterialCommunityIcon
                name={iconName}
                size={30}
                color={iconColor}
              />
            );
          },
          tabBarActiveTintColor: "#D1D1D1",
          tabBarInactiveTintColor: "#858585",
          headerShown: false,
          lazy: true,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#101010",
            paddingTop: 5,
            paddingBottom: 35,
            borderTopWidth: 2,
            borderTopColor: "#212121",
          },
        })}
      >
        <Tab.Screen name="MainTab" component={MainScreenStack} />
        <Tab.Screen name="CameraTab" component={CameraScreenStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    alignItems: "center",
    justifyContent: "center",
  },
});
