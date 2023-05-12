import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Pressable,
  Text,
  TextInput,
} from "react-native";
import { supabase } from "../lib/initSupabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { makeRedirectUri } from "expo-auth-session";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Dark } from "../lib/Theme";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectUrl = makeRedirectUri({
    scheme: "com.hudsonpryde.ssapp",
  });

  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);

    setLoading(false);
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });
    const { type, url } = await WebBrowser.openAuthSessionAsync(data.url);
    if (type === "success") {
      const access_token = url.match(/access_token=(.*?)&/)[1];
      const refresh_token = url.match(/refresh_token=(.*?)&/)[1];
      await supabase.auth.setSession({
        access_token: access_token,
        refresh_token: refresh_token,
      });
    }
  };

  const signUpWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
    navigation.navigate("Main");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable>
          <MaterialCommunityIcon
            name={"chevron-left"}
            size={38}
            color={Dark.secondary}
          ></MaterialCommunityIcon>
        </Pressable>
      </View>
      <View style={styles.loginBox}>
        <TextInput
          style={[styles.text, styles.loginInput]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={[styles.text, styles.loginInput]}
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <Pressable style={styles.button}>
          <Text style={styles.text} onPress={signInWithEmail}>
            Sign In
          </Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.text} onPress={signInWithGoogle}>
            Google
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Dark.background,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 2,
    width: "100%",
    borderBottomColor: "#212121",
  },
  loginBox: {
    backgroundColor: Dark.quatrenary,
    width: "75%",
    height: "50%",
    alignSelf: "center",
    marginVertical: 25,
    borderRadius: 15,
  },
  loginInput: {
    backgroundColor: Dark.tertiary,
    borderRadius: 10,
    margin: 10,
    marginBottom: 5,
    padding: 10,
    fontSize: 18,
    lineHeight: 26,
  },
  text: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 30,
    color: Dark.primary,
  },
  button: {
    backgroundColor: Dark.secondary,
    alignSelf: "center",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
});

export default LoginScreen;
