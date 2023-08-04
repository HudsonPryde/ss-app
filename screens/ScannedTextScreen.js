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
import env from "../env";
import { Dark } from "../lib/Theme";
import { MaterialIcons } from "@expo/vector-icons";
import { createNotes } from "../lib/api/textProcess";
import { ProgressBar, Snackbar } from "react-native-paper";
import {
  useInterstitialAd,
  TestIds,
  AdsConsent,
} from "react-native-google-mobile-ads";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScan, useScanDispatch } from "../provider/ScanProvider";

// const { selectBasicAds } = await AdsConsent.getUserChoices();

const ScannedTextScreen = ({ navigation }) => {
  const scan = useScan();
  const dispatch = useScanDispatch();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [selectPersonalisedAds, setSelectPersonalisedAds] = useState(false);
  const adUnitId =
    Platform.OS === "ios"
      ? env.APPLE_CAMERA_AD_UNIT_ID
      : env.ANDROID_CAMERA_AD_UNIT_ID;

  useEffect(() => {
    async function getConsent() {
      const { selectPersonalisedAds } = await AdsConsent.getUserChoices();
      return selectPersonalisedAds;
    }
    getConsent().then((res) => {
      setSelectPersonalisedAds(res);
    });
  }, []);

  const Ad = useInterstitialAd(__DEV__ ? TestIds.INTERSTITIAL : adUnitId, {
    requestNonPersonalizedAdsOnly: selectPersonalisedAds,
  });

  useEffect(() => {
    if (scan) {
      setText(scan);
    }
  }, [scan]);

  useEffect(() => {
    Ad.load();
  }, [Ad.load, apiError]);

  useEffect(() => {
    if (Ad.isClosed) {
      // Action after the ad is closed
      handleCreateNotes();
    }
  }, [Ad.isClosed, Ad.navigation]);

  async function handleCreateNotes() {
    try {
      setLoading(true);
      const notes = await createNotes(text);
      // const notes = ["note 1", "note 2", "note 3"];
      // after creation format strings into objects
      const formattedNotes = notes.map((note) => {
        return {
          text: note,
        };
      });
      dispatch({ type: "cleared" });
      setLoading(false);
      navigation.goBack();
      navigation.navigate("CameraNotes", {
        notes: formattedNotes,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setApiError(true);
    }
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
            dispatch({ type: "cleared" });
            navigation.navigate("Camera");
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
          onPress={() => {
            dispatch({ type: "edited", scan: text });
            navigation.navigate("Camera");
          }}
        >
          <Text style={[styles.text, { color: Dark.primary }]}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // navigation.goBack();
            if (Ad.isLoaded) {
              Ad.show();
            } else {
              handleCreateNotes();
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
      <Snackbar
        visible={apiError}
        onDismiss={() => {
          setApiError(false);
        }}
        theme={{ colors: { background: Dark.alert } }}
        style={{
          backgroundColor: Dark.alert,
          borderRadius: 10,
          color: Dark.tertiary,
        }}
        duration={3000}
        elevation={5}
      >
        <Text
          style={{
            color: Dark.tertiary,
            textAlign: "center",
            fontFamily: "inter",
            fontSize: 18,
          }}
        >
          Uh oh! Something went wrong. Please try again later.
        </Text>
      </Snackbar>
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
