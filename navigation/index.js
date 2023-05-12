import React, { useCallback, useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import MainTabs from "./MainTabs";
import Auth from "./AuthStack";
import Loading from "../screens/LoadingScreen";

const Navigation = () => {
  const auth = useContext(AuthContext);
  const user = auth.user;

  const [fontsLoaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsLight: require("../assets/fonts/Poppins-Light.ttf"),
  });

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
      {user == null && <Loading />}
      {user == false && <Auth />}
      {user && <MainTabs />}
    </NavigationContainer>
  );
};

export default Navigation;
