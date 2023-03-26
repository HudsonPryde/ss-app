import React, { useState, useRef, useEffect } from "react";
import { Dark } from "../lib/Theme";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  ActivityIndicator,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { getSetNotes, createSetNote } from "../dao/studySets";

const NotebookScreen = ({ route, navigation }) => {
  const { notebookId, notes, notebookColour } = route.params;
  const position = useRef(new Animated.ValueXY()).current;
  const SCREEN_WIDTH = Dimensions.get("screen").width;
  const SCREEN_HEIGHT = Dimensions.get("screen").height;
  const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
  const [isFlipped, setIsFlipped] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [noteNumber, setNoteNumber] = useState(0);

  useEffect(() => {
    console.log(noteNumber, notes);
  }, [noteNumber]);

  const handleNextNote = () => {
    if (noteNumber == notes.length - 1) {
      return false;
    }
    setNoteNumber(noteNumber + 1);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    Animated.timing(animation, {
      toValue: isFlipped ? 0 : 180,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = animation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = animation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateX: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateX: backInterpolate }],
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          // Swiped to the right
          Animated.spring(position, {
            toValue: { x: SCREEN_WIDTH, y: 0 },
            useNativeDriver: true,
          }).start(() => {
            // Animation completed, move the component back to the center
            Animated.timing(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: true,
              duration: 0,
            }).start();
          });
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: {
              x: -SCREEN_WIDTH,
              y: 0,
            },
            useNativeDriver: true,
          }).start(() => {
            // set next note
            // Animation completed, move the component back to the center
            Animated.timing(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: true,
              duration: 0,
            }).start();
          });
        } else {
          // Not a swipe
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { borderBottomColor: notebookColour }]}>
        {/* back button */}
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginHorizontal: 10 }}
        >
          <MaterialCommunityIcon
            name={"chevron-left"}
            size={42}
            color={Dark.secondary}
          ></MaterialCommunityIcon>
        </Pressable>
      </View>
      {/* main question container */}
      <Animated.View
        style={[
          styles.cardContainer,
          { transform: position.getTranslateTransform() },
        ]}
        {...panResponder.panHandlers}
        onResponderEnd={handleNextNote}
      >
        <Pressable
          onPress={handleFlip}
          style={{ width: "100%", height: "100%" }}
        >
          <Animated.View style={[styles.card, frontAnimatedStyle]}>
            <Text style={styles.cardText}>{notes[noteNumber].question}</Text>
          </Animated.View>
          <Animated.View
            style={[styles.card, styles.backCard, backAnimatedStyle]}
          >
            <Text style={styles.cardText}>{notes[noteNumber].answer}</Text>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Dark.background,
    alignItems: "center",
    justifyContent: "start",
  },
  cardContainer: {
    width: "80%",
    height: "60%",
    alignSelf: "center",
    marginTop: "10%",
    backgroundColor: "transparent",
  },
  card: {
    // borderWidth: 2,
    padding: 5,
    borderRadius: 25,
    width: "100%",
    height: "100%",
    backgroundColor: "#242424",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  backCard: {
    position: "absolute",
    top: 0,
  },
  cardText: {
    color: Dark.primary,
    fontSize: 20,
  },

  header: {
    paddingVertical: 20,
    backgroundColor: Dark.header,
    textAlignVertical: "center",
    alignItems: "flex-start",
    borderBottomColor: "#858585",
    width: "100%",
    borderBottomWidth: 2,
  },
});

export default NotebookScreen;
