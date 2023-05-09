import React, { useState, useEffect } from "react";
import env from "../env";
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
import { makeRedirectUri, startAsync } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Dark } from "../lib/Theme";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectUrl = makeRedirectUri({ path: "/auth/callback" });
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   iosClientId:
  //     "1089486777421-c5kth7j1vt2s6bem3286pfs1lb6t7ju8.apps.googleusercontent.com",
  //   expoClientId:
  //     "1089486777421-vmviottmtg79toqgdfrnukfn3qpnjdiv.apps.googleusercontent.com",
  // });

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     console.log(response);
  //     supabase.auth.setSession({
  //       access_token: response.authentication.accessToken,
  //     });
  //   }
  // }, [response]);

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
    const authResponse = await startAsync({
      authUrl: `${env.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`,
      returnUrl: redirectUrl,
    });
    if (authResponse.type === "success") {
      supabase.auth.setSession({
        access_token: authResponse.params.access_token,
        refresh_token: authResponse.params.refresh_token,
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
    alignItems: "start",
    justifyContent: "start",
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
