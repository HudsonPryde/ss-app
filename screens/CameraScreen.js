import React, { useState, useRef, useEffect } from "react";
import * as SecureStorage from "expo-secure-store";
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
import { Dark } from "../lib/Theme";
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
  const [user, setUser] = useState(null);
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

  React.useEffect(() => {
    const getUser = async () => {
      await SecureStorage.getItemAsync("supabase.auth.user").then(
        async (res) => {
          setUser(JSON.parse(res));
        }
      );
    };
    getUser();
  }, []);

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
          // commented out for testing
          // onPress={async () => {
          //   if (cameraRef.current) {
          //     let photo = await cameraRef.current.takePictureAsync();
          //     const imgText = await handleImage(
          //       photo,
          //       height,
          //       width,
          //       frameLayout.x,
          //       frameLayout.y + headerLayout.height,
          //       screenH,
          //       screenW
          //     );
          //     // handleCreateNotes(imgText);
          //   }
          // }}
          // bypass picture taking for testing notes screen
          onPress={() => {
            navigation.navigate("Notes", { user: user });
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
              uploadPhoto(img);
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
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});

export default CameraScreen;
