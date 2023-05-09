import { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStorage from "expo-secure-store";
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
import { supabase } from "./lib/initSupabase";

const HomeStack = createNativeStackNavigator();
const NotesStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const CameraScreenStack = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Camera"
      animation="slide_from_bottom"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <HomeStack.Screen name="Camera" component={CameraScreen} />
      <HomeStack.Screen name="Notes" component={NotesScreen} />
    </HomeStack.Navigator>
  );
};

const MainScreenStack = (props) => {
  return (
    <NotesStack.Navigator
      initialRouteName="Main"
      animation="slide_from_bottom"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "black",
        },
      }}
      session={props.session}
    >
      <NotesStack.Screen
        name="Main"
        component={MainScreen}
        session={props.session}
      />
      <NotesStack.Screen name="Notebook" component={NotebookScreen} />
      <NotesStack.Screen name="Flashcards" component={FlashcardScreen} />
    </NotesStack.Navigator>
  );
};

const LoginScreenStack = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      animation="slide_from_bottom"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
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
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    const getStoredSession = async () => {
      const tokens = await SecureStorage.getItemAsync("supabase.auth.session");
      if (!tokens) return;
      try {
        supabase.auth.setSession(tokens).then(({ data: { session } }) => {
          setSession(session);
        });
      } catch (error) {
        console.error(error);
      }
    };
    getStoredSession();
  }, []);

  useEffect(() => {
    const storeSession = async () => {
      if (!session) return;
      await SecureStorage.setItemAsync(
        "supabase.auth.session",
        JSON.stringify({
          refresh_token: session.refresh_token,
          access_token: session.access_token,
        })
      );
      await SecureStorage.setItemAsync(
        "supabase.auth.user",
        JSON.stringify(session.user)
      );
    };
    storeSession();
  }, [session]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer
      onLayout={onLayoutRootView}
      style={{ backgroundColor: "black" }}
    >
      {session && session.user ? (
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
      ) : (
        <AuthStack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <AuthStack.Screen name="LoginStack" component={LoginScreenStack} />
        </AuthStack.Navigator>
      )}
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
