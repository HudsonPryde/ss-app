import React, { useState, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import * as ImageManipulator from "expo-image-manipulator";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PanResponder,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const { uploadPhoto } = require("../lib/api/imageProcess.js");
const { createNotes } = require("../lib/api/textProcess.js");

async function handleImage(img, h, w, x, y, screenH, screenW) {
  // console.log(h, w, x, y);
  x_ratio = img.height / screenH;
  y_ratio = img.width / screenW;
  crop_x = x * x_ratio;
  crop_y = y * y_ratio;
  crop_h = h * y_ratio;
  crop_w = w * x_ratio;
  console.log(crop_x, crop_y, crop_h, crop_w);
  const croppedImage = await ImageManipulator.manipulateAsync(
    img.uri,
    [
      {
        crop: {
          originX: crop_x,
          originY: crop_y,
          width: crop_w,
          height: crop_h,
        },
      },
    ],
    { format: ImageManipulator.SaveFormat.PNG }
  );
  // console.log(croppedImage);
  // console.log(img);
  const imgText = await uploadPhoto(croppedImage);
  return imgText;
}

async function handleCreateNotes(text) {
  console.log("img text:", text);
  createNotes(text);
}

const CameraScreen = ({ navigation }) => {
  const cameraRef = useRef(null);
  const screenH = Dimensions.get("screen").height;
  const screenW = Dimensions.get("screen").width;
  const [frameLayout, setFrameLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [headerLayout, setHeaderLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [mediaPermision, requestMediaPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [type, setType] = useState(CameraType.back);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(screenH / 2);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      let newWidth = width + gestureState.dx;
      let newHeight = height + gestureState.dy;
      newWidth =
        newWidth > screenW - 10
          ? screenW - 10
          : newWidth < 100
          ? 100
          : newWidth;

      newHeight =
        newHeight > screenH / 2
          ? screenH / 2
          : newHeight < 100
          ? 100
          : newHeight;

      setWidth(newWidth);
      setHeight(newHeight);
    },
  });

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return <Text>No access to camera</Text>;
  }
  return (
    <Camera
      style={{ flex: 1 }}
      type={type}
      ref={cameraRef}
      flashMode={flashMode}
    >
      <View
        style={{ flex: 1 }}
        onLayout={(e) => {
          const { x, y, width, height } = e.nativeEvent.layout;
          setHeaderLayout({ x, y, width, height });
        }}
      ></View>
      <SafeAreaView style={{ flex: 3 }}>
        <View
          onLayout={(e) => {
            const { x, y, width, height } = e.nativeEvent.layout;
            setFrameLayout({ x, y, width, height });
          }}
          style={[
            {
              width: width,
              height: height,
              backgroundColor: "rgba(188, 188, 188, 0.4)",
              alignSelf: "center",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              position: "relative",
              overflow: "hidden",
              zIndex: 100,
              elevation: 100,
            },
          ]}
          {...panResponder.panHandlers}
        ></View>
      </SafeAreaView>
      <SafeAreaView style={styles.container}>
        {/* CAMERA BUTTON */}
        <TouchableOpacity
          style={{
            alignSelf: "center",
            // marginBottom: 25,
          }}
          onPress={async () => {
            if (cameraRef.current) {
              let photo = await cameraRef.current.takePictureAsync();
              const imgText = await handleImage(
                photo,
                height,
                width,
                frameLayout.x,
                frameLayout.y + headerLayout.height,
                screenH,
                screenW
              );
              // handleCreateNotes(imgText);
            }
          }}
        >
          <MaterialIcon
            name={"radio-button-unchecked"}
            size={95}
            style={{ color: "#f2f2f2" }}
          />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "space-around",
            width: "100%",
            paddingHorizontal: 20,
          }}
        >
          {/* NOTEBOOK ICON BUTTON */}
          <TouchableOpacity
            style={{
              flex: 0,
              // marginTop: 25,
              // marginLeft: 25,
            }}
            onPress={() => navigation.navigate("Notebook")}
          >
            <MaterialIcon
              name={"book"}
              size={45}
              style={{ color: "#f2f2f2" }}
            />
          </TouchableOpacity>
          {/* Flash light toggle */}
          <TouchableOpacity
            style={{
              flex: 0,
              // marginTop: 25,
              // marginLeft: 25,
            }}
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
              size={45}
              style={{ color: "#f2f2f2" }}
            />
          </TouchableOpacity>

          {/* Media Library icon */}
          <TouchableOpacity
            style={{
              flex: 0,
              // marginTop: 25,
              // marginRight: 25,
            }}
            onPress={async () => {
              res = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                allowsMultipleSelection: false,
                quality: 1,
              });
              if (!res.canceled) {
                const img = res.assets[0];
                uploadPhoto(img);
                // after successful upload navigate to notes screen
              }
            }}
          >
            <MaterialIcon
              name={"add-photo-alternate"}
              size={45}
              style={{ color: "#f2f2f2" }}
            />
          </TouchableOpacity>

          {/* Profile icon */}
          <TouchableOpacity
            style={{
              flex: 0,
              // marginTop: 25,
              // marginRight: 25,
            }}
            onPress={() => navigation.navigate("Login")}
          >
            <MaterialIcon
              name={"account-circle"}
              size={45}
              style={{ color: "#f2f2f2" }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Camera>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
});

export default CameraScreen;
