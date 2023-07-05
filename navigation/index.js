import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import MainTabs from "./MainTabs";
import Auth from "./AuthStack";
import Loading from "../screens/LoadingScreen";
import OfflineScreen from "../screens/OfflineScreen";
import NetInfo from "@react-native-community/netinfo";

const Navigation = () => {
  const [connected, setConnected] = useState(true);
  const auth = useContext(AuthContext);
  const user = auth.user;

  useEffect(() => {
    NetInfo.addEventListener((state) => {
      setConnected(state.isInternetReachable);
    });
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsLight: require("../assets/fonts/Poppins-Light.ttf"),
    Inter: require("../assets/fonts/Inter-Regular.ttf"),
    InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (connected === false) {
    return <OfflineScreen />;
  }

  return (
    <NavigationContainer
      onLayout={onLayoutRootView}
      theme={{ colors: { background: "transparent" } }}
      style={{ backgroundColor: "black" }}
    >
      {user == null && <Loading />}
      {user == false && <Auth />}
      {user && <MainTabs />}
    </NavigationContainer>
  );
};

export default Navigation;
