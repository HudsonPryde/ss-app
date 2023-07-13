import React from "react";
import { View, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { MaterialIcons } from "@expo/vector-icons";
import MainNav from "./MainStack";
import CameraNav from "./CameraStack";
import SpeechNav from "./SpeechStack";

const Tab = createBottomTabNavigator();
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        lazy: false,
        tabBarIcon: ({ focused }) => {
          let iconName;
          let iconColor = focused ? "#D1D1D1" : "#858585";
          if (route.name === "CameraTab") {
            iconName = "photo-camera";
          } else if (route.name === "MainTab") {
            iconName = "format-list-bulleted";
          } else if (route.name === "SpeechTab") {
            iconName = "mic";
          }
          return <MaterialIcons name={iconName} size={30} color={iconColor} />;
        },
        tabBarActiveTintColor: "#D1D1D1",
        tabBarInactiveTintColor: "#858585",
        headerShown: false,
        lazy: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#101010",
          borderTopWidth: 2,
          borderTopColor: "#212121",
        },
      })}
    >
      <Tab.Screen name="MainTab" component={MainNav} options={{}} />
      <Tab.Screen name="CameraTab" component={CameraNav} />
      <Tab.Screen name="SpeechTab" component={SpeechNav} />
    </Tab.Navigator>
  );
};

export default MainTabs;
