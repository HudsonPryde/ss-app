import React, { useState, useEffect, useRef } from "react";
import { Dark } from "../lib/Theme";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  Canvas,
  Rect,
  LinearGradient,
  Skia,
  Shader,
  vec,
  useSharedValueEffect,
  useValue,
  runTiming,
} from "@shopify/react-native-skia";
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  Easing,
  withTiming,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

const CropScreen = ({ emitCropLayout, startScan }) => {
  const { height, width } = Dimensions.get("window");
  const [cropLayout, setCropLayout] = useState(null);
  const cropWidth = useSharedValue(width / 2);
  const cropHeight = useSharedValue(height / 2);

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startY = cropHeight.value;
      ctx.startX = cropWidth.value;
    },
    onActive: (event, ctx) => {
      if (
        ctx.startY + event.translationY > 60 &&
        ctx.startY + event.translationY < height * 0.65
      ) {
        cropHeight.value = event.translationY + ctx.startY;
      }
      if (
        ctx.startX + event.translationX > 100 &&
        ctx.startX + event.translationX < width * 0.95
      ) {
        cropWidth.value = event.translationX + ctx.startX;
      }
    },
    onEnd: (event, ctx) => {
      ctx.startY = cropHeight.value;
      ctx.startX = cropWidth.value;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: cropWidth.value,
      height: cropHeight.value,
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    return {
      borderRadius: 5,
      borderTopWidth: height / 2 - cropHeight.value / 2,
      borderLeftWidth: width / 2 - cropWidth.value / 2,
      borderBottomWidth: height / 2 - cropHeight.value / 2,
      borderRightWidth: width / 2 - cropWidth.value / 2,
      borderColor: "rgba(0,0,0,0.4)",
    };
  });

  return (
    <GestureHandlerRootView>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <PanGestureHandler onGestureEvent={eventHandler}>
          <Animated.View
            style={[
              {
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.2)",
              },
              borderStyle,
            ]}
          >
            <Animated.View
              style={[styles.container, animatedStyle]}
              ref={(ref) => {
                this.cropView = ref;
              }}
              onLayout={(event) => {
                if (this.cropView) {
                  this.cropView.measure((x, y, width, height, pageX, pageY) => {
                    setCropLayout({ x, y, width, height, pageX, pageY });
                    emitCropLayout({ x, y, width, height, pageX, pageY });
                  });
                }
              }}
            >
              <View style={styles.row}>
                <View style={styles.topLeftCorner}></View>
                <View style={styles.topRightCorner}></View>
              </View>
              <View style={styles.row}>
                <View style={styles.bottomLeftCorner}></View>
                <View style={styles.bottomRightCorner}></View>
              </View>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignSelf: "center",
    borderRadius: 5,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topRightCorner: {
    width: 20,
    height: 20,
    borderTopRightRadius: 5,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: "white",
    right: -2,
    top: -2,
  },
  topLeftCorner: {
    width: 20,
    height: 20,
    borderTopLeftRadius: 5,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: "white",
    top: -2,
    left: -2,
  },
  bottomLeftCorner: {
    width: 20,
    height: 20,
    borderBottomLeftRadius: 5,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: "white",
    bottom: -2,
    left: -2,
  },
  bottomRightCorner: {
    width: 20,
    height: 20,
    borderBottomRightRadius: 5,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: "white",
    bottom: -2,
    right: -2,
  },
});
export default CropScreen;
