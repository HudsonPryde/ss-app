import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

const CropScreen = ({ navigation, route }) => {
  const { height, width } = Dimensions.get("screen");
  const cropWidth = useSharedValue(width / 2);
  const cropHeight = useSharedValue(height / 2);

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startY = cropHeight.value;
      ctx.startX = cropWidth.value;
    },
    onActive: (event, ctx) => {
      cropWidth.value = event.translationX + ctx.startX;
      cropHeight.value = event.translationY + ctx.startY;
    },
    onEnd: (event, ctx) => {
      ctx.startY = cropHeight.value;
      ctx.startX = cropWidth.value;
    },
  });

  useEffect(() => {
    console.log(cropWidth.value, cropHeight.value);
  }, [cropWidth.value, cropHeight.value]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: cropWidth.value,
      height: cropHeight.value,
    };
  });

  return (
    <GestureHandlerRootView>
      <View
        style={{
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <PanGestureHandler onGestureEvent={eventHandler}>
          <Animated.View style={[styles.container, animatedStyle]}>
            <View style={styles.row}>
              <View style={styles.circle}></View>
              <View style={styles.circle}></View>
            </View>
            <View style={styles.row}>
              <View style={styles.circle}></View>
              <View style={styles.circle}></View>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "transparent",
    flexDirection: "column",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
  },
});
export default CropScreen;
