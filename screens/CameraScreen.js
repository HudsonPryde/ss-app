import React, { useState, useRef, useEffect, useContext } from "react";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  Button,
  Image,
  Platform,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  runOnUI,
} from "react-native-reanimated";
import { Dark, Notebook } from "../lib/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../provider/AuthProvider";
import MlkitOcr, { MlkitOcrResult } from "react-native-mlkit-ocr";

SCREEN_HEIGHT = Dimensions.get("screen").height;

const CameraScreen = ({ navigation, route }) => {
  const { session, user } = useContext(AuthContext);
  const { initText } = route.params;
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentBoundingBoxes, setCurrentBoundingBoxes] = useState([]);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [mediaPermision, requestMediaPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [cameraLayout, setCameraLayout] = useState(0);
  const [showBoundings, setShowBoundings] = useState(false);
  const [scannedText, setScannedText] = useState("");
  const scannedTextDrawerRef = useRef(null);
  const boxOpacity = useSharedValue(0);
  const scanBarPos = useSharedValue(SCREEN_HEIGHT);

  // TODO: add bounding box animation to show what was scanned

  useEffect(() => {
    setScannedText(initText);
  }, [initText]);

  const scanScreen = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: scanBarPos.value,
        },
      ],
    };
  });

  function fitWidth(value, imageWidth) {
    return (value / imageWidth) * cameraLayout.width;
  }

  function fitHeight(value, imageHeight) {
    return (value / imageHeight) * cameraLayout.height;
  }

  const handleImageCapture = async () => {
    const res = await cameraRef.current.takePictureAsync();
    const image = await ImageManipulator.manipulateAsync(res.uri, [], {
      compress: 1,
      format: "png",
    });
    cameraRef.current.pausePreview();
    const ocrResult = await MlkitOcr.detectFromUri(image.uri);
    setCurrentImage(image);
    setCurrentBoundingBoxes(ocrResult);
    scanBarPos.value = withTiming(
      -SCREEN_HEIGHT,
      {
        duration: 1000,
        easing: Easing.linear,
      },
      () => {
        runOnJS(handleImageCaptureResults)(ocrResult);
      }
    );
    // setShowBoundings(true);
    // Animated.stagger(1000, [fadeinBoxAnimation, fadeoutBoxAnimation]);
  };

  const handleImageCaptureResults = (ocrResult) => {
    scanBarPos.value = 0;
    const text = retrieveScannedText(ocrResult);
    setScannedText(text);
    navigation.navigate("ScannedText", { initText: text });
    cameraRef.current.resumePreview();
  };

  const handleImageImport = async (image) => {
    const ocrResult = await MlkitOcr.detectFromUri(image.uri);
    setCurrentImage(image);
    handleImageCaptureResults(ocrResult);
    // setShowBoundings(true);
    // Animated.stagger(1000, [fadeinBoxAnimation, fadeoutBoxAnimation]);
  };

  const retrieveScannedText = (boxes) => {
    let text = scannedText;
    boxes.forEach((box) => {
      text += box.text + " ";
    });
    if (text.length > 4000) {
      text = text.substring(0, 4000);
    }
    return text;
  };

  const boundingBoxes = currentBoundingBoxes.map((box, index) => {
    return (
      <View
        key={index}
        style={{
          top: fitHeight(box.bounding.top, currentImage?.height ?? 0),
          left: fitWidth(box.bounding.left, currentImage?.width ?? 0),
          height: fitHeight(box.bounding.height, currentImage?.height ?? 0),
          width: fitWidth(box.bounding.width, currentImage?.width ?? 0),
          position: "absolute",
          borderColor: "gold",
          borderWidth: 1,
          borderStyle: "dashed",
          borderRadius: 15,
        }}
      ></View>
    );
  });

  const cameraButton = (
    <View style={styles.row}>
      {/* CAMERA BUTTON */}
      <View style={{ flex: 1 }} />
      <View
        style={{
          backgroundColor: "#6A4195",
          borderRadius: 50,
          padding: 20,
          marginVertical: 15,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.35,
          shadowRadius: 3.84,
        }}
      >
        <TouchableOpacity
          onPress={async () => {
            handleImageCapture();
          }}
        >
          <MaterialIcons
            name={"center-focus-weak"}
            size={45}
            style={{ color: "white" }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.scannedTextButton}>
        <View style={[styles.pillConatiner, { marginTop: 25 }]}>
          {/* edit scanned text button */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ScannedText", { initText: scannedText });
            }}
          >
            <MaterialIcons
              name={"notes"}
              size={28}
              style={{ color: "white" }}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.text, { color: Dark.primary, fontSize: 12 }]}>
          Scanned text
        </Text>
      </View>
    </View>
  );

  const topButtons = (
    <View style={styles.row}>
      {/* container for flashlight and image library buttons */}
      <View style={styles.pillConatiner}>
        {/* Flash light toggle */}
        <TouchableOpacity
          onPress={() => {
            if (flashMode === Camera.Constants.FlashMode.off) {
              setFlashMode(Camera.Constants.FlashMode.torch);
            } else {
              setFlashMode(Camera.Constants.FlashMode.off);
            }
          }}
        >
          <MaterialIcon
            name={
              flashMode == Camera.Constants.FlashMode.off
                ? "flash-off"
                : "flash-on"
            }
            size={25}
            style={{ color: "white" }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.pillConatiner}>
        {/* Media Library icon */}
        <TouchableOpacity
          onPress={async () => {
            res = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              allowsMultipleSelection: false,
              quality: 1,
            });
            if (!res.canceled) {
              const img = res.assets[0];
              // after successful upload navigate to notes screen
              handleImageImport(img);
            }
          }}
        >
          <MaterialIcon
            name={"photo-library"}
            size={25}
            style={{
              color: "white",
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const textDrawer = (
    <View style={[styles.textDrawer]}>
      <View
        style={{ flexDirection: "column", width: 20, justifyContent: "center" }}
      >
        <View
          style={{
            height: 45,
            width: 5,
            backgroundColor: Dark.primary,
            borderRadius: 10,
            alignSelf: "center",
          }}
        ></View>
      </View>
      <View
        style={{
          flexDirection: "column",
          width: Dimensions.get("screen").width * 0.8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            height: 30,
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", alignSelf: "center" }}>
            <Text style={[styles.header, { lineHeight: 20 }]}>
              Scanned Text
            </Text>
            <Text
              style={[
                styles.text,
                { color: Dark.secondary, marginLeft: 5, lineHeight: 18 },
              ]}
            >
              {scannedText.length}/4000
            </Text>
          </View>
          <Pressable
            style={[styles.clearButton, { marginTop: 10, alignSelf: "center" }]}
            onPress={() => {
              setScannedText("");
            }}
          >
            <Text
              style={[styles.text, { color: Dark.tertiary, lineHeight: 18 }]}
            >
              clear
            </Text>
          </Pressable>
        </View>
        <KeyboardAvoidingView
          keyboardVerticalOffset={140}
          behavior="padding"
          style={styles.textField}
        >
          <TextInput
            multiline={true}
            maxLength={4000}
            textAlign="left"
            textAlignVertical="top"
            value={scannedText}
            onBlur={Keyboard.dismiss}
            onChangeText={(text) => setScannedText(text)}
            style={[styles.text, { lineHeight: 20, padding: 10 }]}
          ></TextInput>
        </KeyboardAvoidingView>
        <TouchableOpacity style={styles.makeNotesButton}>
          <Text
            style={[
              styles.text,
              {
                color: Dark.primary,
                lineHeight: 32,
                fontSize: 18,
                textAlign: "center",
                fontFamily: "Poppins",
              },
            ]}
          >
            Generate notes
          </Text>
          <MaterialCommunityIcon
            name={"arrow-right"}
            size={25}
            style={{ color: Dark.primary, marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  if (!permission || !mediaPermision) {
    return null;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  return (
    <Camera
      type={Camera.Constants.Type.back}
      ref={cameraRef}
      flashMode={flashMode}
      onLayout={(e) => {
        setCameraLayout(e.nativeEvent.layout);
      }}
    >
      <SafeAreaView edges={["top", "left", "right"]} style={styles.camera}>
        {/* camera preview */}

        {topButtons}
        {/* <ScrollView
          ref={scannedTextDrawerRef}
          horizontal
          pagingEnabled
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyboardDismissMode="on-drag"
          style={{
            paddingLeft: Dimensions.get("screen").width * 0.1,

            width: "100%",
            overflow: "visible",
          }}
          contentContainerStyle={{
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <View style={{ width: Dimensions.get("screen").width * 0.85 }}></View>
          {textDrawer}
        </ScrollView> */}
        {cameraButton}
      </SafeAreaView>
      {/* scan bar */}
      <Animated.View
        style={[
          { height: 5, width: "100%", backgroundColor: Dark.info },
          scanScreen,
        ]}
      ></Animated.View>
      {/* results image */}
      {showBoundings ? (
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: "transparent" }]}
        >
          {boundingBoxes}
        </Animated.View>
      ) : null}
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size={"large"} color={Dark.primary} />
        </View>
      ) : null}
    </Camera>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    height: "100%",
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 30,
    color: Dark.primary,
  },
  text: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 30,
    color: Dark.primary,
  },
  floatingButton: {
    borderRadius: 50,
    opacity: 0.75,
    backgroundColor: Dark.secondary,
    alignSelf: "center",
    padding: 5,
    margin: 5,
  },
  textDrawer: {
    flexDirection: "row",
    width: Dimensions.get("screen").width,
    height: "85%",
    backgroundColor: Dark.tertiary,
    borderRadius: 10,
    paddingVertical: 15,
  },
  textField: {
    borderRadius: 10,
    backgroundColor: Dark.quatrenary,
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "column",
    justifyContent: "center",
  },
  loadingIndicator: {
    alignSelf: "center",
    height: 5,
    width: "100%",
    borderRadius: 15,
    backgroundColor: Dark.info,
  },
  clearButton: {
    backgroundColor: Dark.secondary,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 20,
    alignSelf: "center",
    flexDirection: "row",
  },
  pillConatiner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingVertical: 5,
    padding: 15,
    alignSelf: "center",
    marginHorizontal: 10,
  },
  makeNotesButton: {
    backgroundColor: Notebook.cerulean,
    borderRadius: 25,
    paddingHorizontal: 5,
    marginTop: 15,
    width: "100%",
    height: 35,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  scannedTextButton: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
  },
});

export default CameraScreen;
