import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";

const AuthStack = createNativeStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animationTypeForReplace: "push",
          lazy: false,
        }}
      />
      <AuthStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          animationTypeForReplace: "push",
          lazy: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

export default Auth;
