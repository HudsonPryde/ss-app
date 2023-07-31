import React, { useEffect, useState, useContext } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
} from "react-native";
import { supabase } from "../lib/initSupabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dark } from "../lib/Theme";
import * as Google from "expo-auth-session/providers/google";
// check if apple sign in is available
import * as AppleAuthentication from "expo-apple-authentication";

import env from "../env";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [req, _res, promptAsync] = Google.useAuthRequest({
    selectAccount: true,
    shouldAutoExchangeCode: false,
    expoClientId: "",
    iosClientId: "",
    androidClientId: "",
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
    try {
      let res = await promptAsync({
        url: `${env.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${req?.redirectUri}&prompt=select_account`,
      });
      // After we got refresh token with the response, we can send it to supabase to sign-in the user
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: res.params.refresh_token,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // console.log(credential);
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={signInWithGoogle}
          style={[styles.button, { backgroundColor: "white" }]}
        >
          <Image
            source={require("../assets/icons/google-logo.png")}
            style={{ width: 16, height: 16, marginRight: 5 }}
          />
          <Text
            style={[
              styles.text,
              {
                color: Dark.background,
                fontFamily: "InterSemiBold",
                letterSpacing: 0,
              },
            ]}
          >
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>
      {AppleAuthentication.isAvailableAsync() && (
        <View style={styles.row}>
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={5}
            style={[styles.button, { backgroundColor: "transparent" }]}
            onPress={signInWithApple}
          />
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.text}>- or -</Text>
      </View>
      <TextInput
        style={[styles.text, styles.loginInput]}
        placeholder="Email..."
        placeholderTextColor={Dark.secondary}
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.text, styles.loginInput]}
        placeholder="Password..."
        placeholderTextColor={Dark.secondary}
        value={password}
        secureTextEntry={true}
        maxLength={20}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#4286f4" }]}
        onPress={signInWithEmail}
      >
        <Text style={[styles.text, { color: "white" }]}>
          Continue with Email
        </Text>
      </TouchableOpacity>
      <View style={styles.row}>
        <Text
          style={[
            styles.text,
            {
              fontSize: 14,
              lineHeight: 23,
              fontFamily: "PoppinsRegular",
              color: Dark.secondary,
            },
          ]}
        >
          Don't have an account?{" "}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Signup");
          }}
        >
          <Text
            style={[
              styles.text,
              {
                fontSize: 14,
                lineHeight: 23,
                fontFamily: "PoppinsRegular",
                color: Dark.info,
              },
            ]}
          >
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Dark.tertiary,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    paddingVertical: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
    borderRadius: 10,

    justifyContent: "flex-start",
  },
  loginInput: {
    backgroundColor: Dark.background,
    borderRadius: 5,
    margin: 10,
    marginBottom: 5,
    padding: 10,
    fontSize: 18,
    borderWidth: 1,
    width: "90%",
    borderColor: Dark.quatrenary,
    alignSelf: "center",
    fontFamily: "Inter",
  },
  text: {
    fontFamily: "InterSemiBold",
    fontSize: 16,
    lineHeight: 22,
    color: Dark.primary,
  },

  button: {
    alignSelf: "center",
    borderRadius: 5,
    width: "90%",
    height: 44,
    marginVertical: 10,
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default LoginScreen;
