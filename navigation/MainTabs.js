import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MainNav from "./MainStack";
import CameraNav from "./CameraStack";

const Tab = createBottomTabNavigator();
const MainTabs = () => {
  return (
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
      <Tab.Screen name="MainTab" component={MainNav} />
      <Tab.Screen name="CameraTab" component={CameraNav} />
    </Tab.Navigator>
  );
};

export default MainTabs;
