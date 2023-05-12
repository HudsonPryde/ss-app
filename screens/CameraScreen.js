import React, { useState, useRef, useEffect, useContext } from "react";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import * as ImageManipulator from "expo-image-manipulator";
import {
  Animated,
  StyleSheet,
  View,
  TouchableOpacity,
  PanResponder,
  Dimensions,
  Text,
  Button,
  Image,
} from "react-native";
import { Dark } from "../lib/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../provider/AuthProvider";
import MlkitOcr, { MlkitOcrResult } from "react-native-mlkit-ocr";

async function handleCreateNotes(text) {
  console.log("img text:", text);
  createNotes(text);
}

function fitWidth(value, imageWidth) {
  const fullWidth = Dimensions.get("window").width;
  return (value / imageWidth) * fullWidth;
}

function fitHeight(value, imageHeight) {
  const fullHeight = Dimensions.get("window").height;
  return (value / imageHeight) * fullHeight;
}

const CameraScreen = ({ navigation }) => {
  const { session, user } = useContext(AuthContext);
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [mediaPermision, requestMediaPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [boundingBoxes, setBoundingBoxes] = useState([]);

  async function handleImage(img) {
    const { uri } = img;
    try {
      const img = await ImageManipulator.manipulateAsync(uri);
      setImage(img);
      setBoundingBoxes(await MlkitOcr.detectFromUri(img.uri));
    } catch (e) {
      console.error(e);
    }
  }

  const boundingBoxesToViews = (boxes) => {
    return boxes.map((block) => {
      return block.lines.map((line, index) => {
        console.log(line.text);
        return (
          <View
            key={index}
            style={{
              backgroundColor: "red",
              position: "absolute",
              top: fitHeight(line.bounding.top, image.height),
              height: fitHeight(line.bounding.height, image.height),
              left: fitWidth(line.bounding.left, image.width),
              width: fitWidth(line.bounding.width, image.width),
            }}
          >
            <Text style={{ fontSize: 10 }}>{line.text}</Text>
          </View>
        );
      });
    });
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
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
      style={{ flex: 1 }}
      type={CameraType.back}
      ref={cameraRef}
      flashMode={flashMode}
    >
      <Image
        style={{
          position: "absolute",
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width,
        }}
        source={{ uri: image.uri }}
      />
      {/* Bounding boxes */}
      {boundingBoxesToViews(boundingBoxes)}
      <View style={styles.row}>
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
            size={35}
            style={{ color: Dark.primary }}
          />
        </TouchableOpacity>
        {/* CAMERA BUTTON */}
        <TouchableOpacity
          style={{ paddingHorizontal: 25 }}
          onPress={async () => {
            if (cameraRef.current) {
              let photo = await cameraRef.current.takePictureAsync({
                quality: 1,
                exif: true,
              });
              const imgText = await handleImage(photo);
              // handleCreateNotes(imgText);
            }
          }}
        >
          <MaterialIcon
            name={"radio-button-unchecked"}
            size={85}
            style={{ color: Dark.primary }}
          />
        </TouchableOpacity>

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
            }
          }}
        >
          <MaterialIcon
            name={"add-photo-alternate"}
            size={35}
            style={{ color: Dark.primary }}
          />
        </TouchableOpacity>
      </View>
    </Camera>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
  },
});

export default CameraScreen;
