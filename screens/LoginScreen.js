import React, { useState } from "react";
import { Alert, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { supabase } from "../lib/initSupabase";
import { Input } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    const session = await supabase.auth.getSession();
    if (session) {
      console.log(session);
      navigation.navigate("Main");
    } else {
      Alert.alert("Session not created");
    }

    setLoading(false);
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

  const LoginInput = (props) => {
    return <View></View>;
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#FFF0E1", height: "100%" }}>
      <View
        style={{
          flex: 0,
          backgroundColor: "transparent",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Main");
          }}
        >
          <MaterialIcon name={"close"} size={55} style={{ color: "#292727" }} />
        </TouchableOpacity>
      </View>
      {/* LOGIN INPUT */}
      <View style={{ paddingTop: 40 }}>
        <View style={styles.shadow}></View>
        <View style={styles.loginInput}>
          <Input
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder={"email"}
            placeholderTextColor={"#000"}
            autoCapitalize={"none"}
            containerStyle={{
              top: 11,
              marginLeft: 25,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
              marginRight: 25,
            }}
            inputStyle={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: "600",
              fontSize: 26,
              color: "#000",
            }}
          />
        </View>
      </View>
      {/* PASSWORD INPUT */}
      <View style={{ paddingTop: 30 }}>
        <View
          style={[
            styles.shadow,
            { top: 11, left: 5, marginRight: 25, backgroundColor: "#C3FCF2" },
          ]}
        ></View>
        <View style={[styles.loginInput, { padding: 0, margin: 20 }]}>
          <Input
            rightIcon={{ type: "materialIcon", name: "visibility-off" }}
            rightIconContainerStyle={{ left: 5 }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="password"
            placeholderTextColor={"#000"}
            autoCapitalize={"none"}
            containerStyle={{
              top: 11,
              marginLeft: 25,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
              marginRight: 35,
            }}
            inputStyle={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: "600",
              fontSize: 26,
              color: "#000",
            }}
          />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.mt20, styles.button, { backgroundColor: "#FFF" }]}
        disabled={loading}
        onPress={() => signInWithEmail()}
      >
        <Text style={styles.text}>login</Text>
      </TouchableOpacity>
      <Text style={styles.text}> or </Text>
      <TouchableOpacity
        disabled={loading}
        onPress={() => signUpWithEmail()}
        style={[styles.button, { backgroundColor: "#2B2B2B" }]}
      >
        <Text style={[styles.text, { color: "#FFF" }]}>sign up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  button: {
    marginHorizontal: 85,
    padding: 15,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 45,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  shadow: {
    padding: 30,
    backgroundColor: "#FCC3C3",
    borderRadius: 45,
    marginRight: 15,
    marginLeft: 25,
    marginBottom: -90,
    borderStyle: "solid",
    borderWidth: 2,
  },
  loginInput: {
    flex: 0,
    alignContent: "center",
    padding: 1,
    backgroundColor: "#FFF",
    margin: 15,
    borderRadius: 45,
    borderStyle: "solid",
    borderWidth: 2,
  },
  text: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 20,
    color: "#292727",
    alignSelf: "center",
  },
});

export default LoginScreen;
