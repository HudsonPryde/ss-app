import React, { useEffect, useState, useContext } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import { supabase } from "../lib/initSupabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Dark } from "../lib/Theme";

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signUpWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
      return;
    } else {
      setLoading(false);
    }
  };

  const checkSignup = () => {
    if (confirmPassword !== password && confirmPassword.length > 0) {
      setError("Passwords do not match");
      return;
    } else if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    } else if (email.length < 1) {
      setError("Email cannot be empty");
      return;
    } else {
      setError("");
      signUpWithEmail();
      console.log(error);
    }
  };

  const handleClose = () => {
    setError("");
    setLoading(false);
    setEmail("");
    setPassword("");
    setConfirm("");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose}>
          <MaterialIcons name="chevron-left" size={32} color={Dark.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.text,
            styles.loginInput,
            ["Email cannot be empty", "User already registered"].includes(error)
              ? { borderColor: Dark.alert }
              : null,
          ]}
          placeholder="Email..."
          textContentType="emailAddress"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        {["Email cannot be empty", "User already registered"].includes(
          error
        ) && (
          <Text style={[styles.errorText, { color: Dark.alert }]}>{error}</Text>
        )}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.text,
            styles.loginInput,
            error === "Password must be at least 8 characters"
              ? { borderColor: Dark.alert }
              : null,
          ]}
          placeholder="Password..."
          textContentType="password"
          passwordRules="minlength: 8; maxlength: 20; required: lower; required: upper; required: digit;"
          value={password}
          maxLength={20}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        {error === "Password must be at least 8 characters" && (
          <Text style={[styles.errorText, { color: Dark.alert }]}>{error}</Text>
        )}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.text,
            styles.loginInput,
            error === "Passwords do not match"
              ? { borderColor: Dark.alert }
              : null,
          ]}
          textContentType="password"
          placeholder="Re-type your password..."
          passwordRules="minlength: 8; maxlength: 20; required: lower; required: upper; required: digit;"
          value={confirmPassword}
          maxLength={20}
          secureTextEntry={true}
          onChangeText={(text) => setConfirm(text)}
        />
        {error === "Passwords do not match" && (
          <Text style={[styles.errorText, { color: Dark.alert }]}>{error}</Text>
        )}
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#4286f4" }]}
        onPress={checkSignup}
      >
        <Text style={[styles.text, { color: "white" }]}>Sign Up</Text>
      </TouchableOpacity>
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
    paddingBottom: 10,
    paddingHorizontal: 15,
    width: "100%",
    alignContent: "center",
    alignItems: "center",
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
    padding: 10,
    fontSize: 18,
    borderWidth: 1,
    width: "100%",
    borderColor: Dark.quatrenary,
  },
  inputRow: {
    margin: 10,
    width: "90%",
    alignSelf: "center",
  },
  text: {
    fontFamily: "Inter",
    fontSize: 16,
    lineHeight: 22,
    color: Dark.primary,
    padding: 10,
    textAlignVertical: "center",
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
  errorText: {
    fontFamily: "Inter",
    fontSize: 12,
    lineHeight: 18,
    marginHorizontal: 5,
    color: Dark.alert,
    textAlignVertical: "center",
  },
});

export default SignupScreen;
