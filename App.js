import React from "react";
import { StatusBar } from "expo-status-bar";
import Navigation from "./navigation";
import { AuthProvider } from "./provider/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
      <StatusBar style={"light"} />
    </AuthProvider>
  );
}
