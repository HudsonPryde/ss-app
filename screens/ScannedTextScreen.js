import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Dark } from "../lib/Theme";
import { MaterialIcons } from "@expo/vector-icons";
import { createNotes } from "../lib/api/textProcess";
import { ProgressBar } from "react-native-paper";
import { useInterstitialAd, TestIds } from "react-native-google-mobile-ads";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions } from "@react-navigation/native";

const ScannedTextScreen = ({ navigation, route }) => {
  const { initText } = route.params;
  const [text, setText] = useState(initText);
  const [loading, setLoading] = useState(false);

  const Ad = useInterstitialAd(TestIds.INTERSTITIAL, {
    requestNonPersonalizedAdsOnly: true,
  });

  useEffect(() => {
    Ad.load();
  }, [Ad.load]);

  useEffect(() => {
    if (Ad.isClosed) {
      // Action after the ad is closed
      handleCreateNotes();
    }
  }, [Ad.isClosed, Ad.navigation]);

  useEffect(() => {
    setText(initText);
  }, [initText]);

  async function handleCreateNotes() {
    setLoading(true);
    const notes = await createNotes(text);
    // const notes = ["note 1", "note 2", "note 3"];
    // after creation format strings into objects
    const formattedNotes = notes.map((note) => {
      return {
        text: note,
      };
    });
    setText("");
    setLoading(false);
    navigation.goBack();
    navigation.navigate("CameraNotes", {
      notes: formattedNotes,
    });
  }

  const scrollHeader = (
    <View>
      <View
        style={[
          styles.header,
          {
            borderBottomWidth: 0,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.pillConatiner}
          onPress={() => {
            setText("");
            // navigation.dispatch({
            //   ...CommonActions.setParams({ initText: "" }),
            //   source: "Camera",
            // });
            // navigation.navigate("Camera", { initText: "" });
          }}
        >
          <MaterialIcons
            name={"close"}
            size={20}
            style={{ color: Dark.primary }}
          />
          <Text style={[styles.text]}>Clear</Text>
        </TouchableOpacity>
        <View style={styles.pillConatiner}>
          <Text style={[styles.text]}>{text.length}/4000</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={
        Platform.OS === "ios"
          ? ["left", "right", "bottom"]
          : ["left", "right", "bottom", "top"]
      }
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Camera", { initText: text })}
        >
          <Text style={[styles.text, { color: Dark.primary }]}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // navigation.goBack();
            if (Ad.isLoaded) {
              Ad.show();
            }
          }}
        >
          <Text style={[styles.text, { color: Dark.info }]}>Make notes</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.scrollContainer}
      >
        <ScrollView
          scrollEnabled={true}
          stickyHeaderIndices={[0]}
          keyboardShouldPersistTaps="handled"
          style={styles.scrollContainer}
        >
          {scrollHeader}

          <TextInput
            style={styles.textInput}
            multiline={true}
            value={text}
            onChangeText={(text) => setText(text)}
            placeholder="Your scanned text will show up here..."
            placeholderTextColor={Dark.secondary}
            autoCorrect={false}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      {/* modal to display loading animation */}
      <Modal animationType="fade" transparent visible={loading}>
        <View style={[styles.modalContainer]}>
          <View style={styles.loadingBox}>
            <Text
              style={[
                styles.text,
                { color: Dark.primary, textAlign: "center" },
              ]}
            >
              One moment generating notes...
            </Text>
            <ProgressBar
              indeterminate={true}
              color={Dark.info}
              style={{ width: 200, height: 5, marginVertical: 10 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  pillConatiner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: Dark.tertiary,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: "flex-end",
    marginHorizontal: 10,
  },
  textInput: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 30,
    color: Dark.primary,
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
  },
  scrollContainer: {
    width: "100%",
    height: "100%",
  },
  loadingBox: {
    height: 150,
    width: 250,
    backgroundColor: Dark.tertiary,
    borderRadius: 15,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
});

export default ScannedTextScreen;
