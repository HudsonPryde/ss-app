import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
  Text,
} from "react-native";
import { Dark } from "../lib/Theme";

const SpeechTextEditScreen = ({ navigation, route }) => {
  const { initText } = route.params;
  const [text, setText] = useState(initText);

  useEffect(() => {
    const truncatedText = initText.slice(0, 4000);
    setText(truncatedText);
  }, [initText]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[styles.text, { color: Dark.primary }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.text, { color: Dark.primary }]}>
          {text.length}/4000
        </Text>
        <Pressable
          onPress={() => navigation.navigate("Audio", { initText: text })}
        >
          <Text style={[styles.text, { color: Dark.info }]}>Save</Text>
        </Pressable>
      </View>
      <TextInput
        style={styles.textInput}
        maxLength={4000}
        multiline={true}
        value={text}
        onChangeText={(text) => setText(text)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Dark.background,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  textInput: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 30,
    color: Dark.primary,
    overflow: "scroll",
    padding: 20,
    paddingBottom: 100,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    width: "100%",
    borderBottomColor: Dark.tertiary,
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 30,
    color: Dark.primary,
    overflow: "scroll",
  },
});

export default SpeechTextEditScreen;
