import React, { useState, useEffect } from "react";
import { Dark, Notebook } from "../lib/Theme";
import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  interpolate,
  Easing,
  interpolateColor,
  useDerivedValue,
  withDelay,
  runOnJS,
  set,
  runOnUI,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { bulkUpsertFlashcards } from "../dao/flashcards";
import { useFlashcardsDispatch } from "../provider/FlashcardsProvider";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

const NotebookScreen = ({ route, navigation }) => {
  const { flashcards, notebook } = route.params;
  const { name: notebookName, colour: notebookColour } = notebook;
  const flashcardsDispatch = useFlashcardsDispatch();

  const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
  const [cardIndex, setCardIndex] = useState(0);
  const [backCardIndex, setBackCardIndex] = useState(1);
  const [answeredCards, setAnsweredCards] = useState([]);
  const [incorrectCards, setIncorrectCards] = useState([]);
  const [showNextCard, setShowNextCard] = useState(true);
  const [flashcardsDone, setFlashcardsDone] = useState(false);
  const flip = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    setShowNextCard(backCardIndex !== flashcards.length);
  }, [backCardIndex]);

  useEffect(() => {
    if (flashcardsDone) {
      // update the times correct/wrong for each card
      bulkUpsertFlashcards(answeredCards);
      // update the flashcards in the context
      flashcardsDispatch({
        type: "bulkUpdated",
        flashcards: answeredCards,
      });
      handleNavigateToResults();
    }
  }, [flashcardsDone]);

  const handleCardAnswered = (isCorrect) => {
    let currentCard = { ...flashcards[cardIndex] };

    // add the card to the answered list and incorrect list if necessary
    if (isCorrect) {
      currentCard.times_correct += 1;
    } else {
      currentCard.times_incorrect += 1;
      setIncorrectCards([...incorrectCards, currentCard]);
    }
    setAnsweredCards([...answeredCards, currentCard]);
  };

  const handleNextCard = () => {
    // increase the card index if there are more cards
    if (cardIndex < flashcards.length - 1) {
      setCardIndex(cardIndex + 1);
    }
  };

  const handleNavigateToResults = () => {
    // navigate to the results screen
    navigation.replace("FlashcardsResults", {
      notebook,
      totalCards: answeredCards,
      incorrectCards,
    });
  };

  const handleUndo = () => {
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
      setBackCardIndex(backCardIndex - 1);
      setAnsweredCards(answeredCards.slice(0, -1));
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        runOnJS(handleCardAnswered)(event.translationX > 0);
        x.value = withTiming(
          event.translationX > 0 ? SCREEN_WIDTH * 2 : -SCREEN_WIDTH * 2,
          {
            duration: 500,
          },
          (finished) => {
            if (finished) {
              if (cardIndex === flashcards.length - 1) {
                runOnJS(setFlashcardsDone)(true);
              } else {
                x.value = 0;
                y.value = 0;
              }
              backCardIndex === flashcards.length - 1
                ? runOnJS(setShowNextCard)(false)
                : null;

              scale.value = withTiming(1, { duration: 1000 }, () => {
                runOnJS(setBackCardIndex)(
                  backCardIndex === flashcards.length - 1
                    ? backCardIndex
                    : backCardIndex + 1
                );
              });
            }
          }
        );
        scale.value = withDelay(
          200,
          withTiming(0, { duration: 0 }, (finished) => {
            if (finished) {
              runOnJS(handleNextCard)();
            }
          })
        );
        flip.value = withDelay(200, withTiming(0, { duration: 0 }));
      } else {
        x.value = withSpring(0);
        y.value = withSpring(0);
      }
    },
  });

  const derivedScale = useDerivedValue(() => {
    const width = interpolate(scale.value, [0, 1], [240, 300]);
    const height = interpolate(scale.value, [0, 1], [336, 420]);
    const top = interpolate(
      scale.value,
      [0, 1],
      [SCREEN_HEIGHT * 0.32, SCREEN_HEIGHT * 0.2]
    );
    const fontSize = interpolate(scale.value, [0, 1], [15, 20]);
    const backgroundColor = interpolateColor(
      scale.value,
      [0, 1],
      [Dark.tertiary, Dark.quatrenary]
    );
    return { width, height, top, fontSize, backgroundColor };
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      x.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [315, 360, 395]
    );
    return {
      transform: [
        {
          translateX: x.value / 1.5,
        },
        {
          translateY: y.value / 1.5,
        },
        {
          rotate: `${rotate}deg`,
        },
      ],
      width: derivedScale.value.width,
      height: derivedScale.value.height,
      marginTop: derivedScale.value.top,
    };
  });

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: derivedScale.value.backgroundColor,
      borderColor: derivedScale.value.backgroundColor,
    };
  });

  const fontAnimatedStyle = useAnimatedStyle(() => {
    return {
      fontSize: derivedScale.value.fontSize,
    };
  });

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const flipVal = interpolate(flip.value, [0, 1], [0, 180]);
    const color = interpolateColor(
      x.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [Notebook.red, Dark.quatrenary, Notebook.emerald]
    );
    return {
      transform: [
        {
          rotateX: `${flipVal}deg`,
        },
      ],
      borderColor: color,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const flipVal = interpolate(flip.value, [0, 1], [180, 360]);
    const color = interpolateColor(
      x.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [Notebook.red, Dark.quatrenary, Notebook.emerald]
    );
    return {
      transform: [
        {
          rotateX: `${flipVal}deg`,
        },
      ],
      borderColor: color,
    };
  }, []);

  const flashcardComponent = (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[styles.cardContainer, animatedStyle]}
        onMoveShouldSetResponderCapture={() => true}
      >
        <Pressable
          onPress={() =>
            (flip.value = withTiming(flip.value ? 0 : 1, {
              duration: 500,
              easing: Easing.linear,
            }))
          }
        >
          <Animated.View
            style={[styles.card, frontAnimatedStyle, animatedCardStyle]}
          >
            <Animated.Text style={[styles.cardText, fontAnimatedStyle]}>
              {flashcards[cardIndex].question}
            </Animated.Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.card,
              styles.backCard,
              backAnimatedStyle,
              animatedCardStyle,
            ]}
          >
            <Animated.Text style={[styles.cardText, fontAnimatedStyle]}>
              {flashcards[cardIndex].answer}
            </Animated.Text>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </PanGestureHandler>
  );

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
        <View>
          <Text style={[styles.heading]}>{notebookName}</Text>
        </View>
      </View>
      {!flashcardsDone && flashcardComponent}
      {showNextCard && (
        <View
          style={[
            styles.cardContainer,
            {
              width: 240,
              height: 336,
              marginTop: SCREEN_HEIGHT * 0.32,
              position: "absolute",
              zIndex: -1,
              elevation: -1,
            },
          ]}
        >
          <View
            style={[
              styles.card,
              { backgroundColor: Dark.tertiary, borderColor: Dark.tertiary },
            ]}
          >
            <Text style={[styles.cardText, { fontSize: 15 }]}>
              {
                flashcards[
                  backCardIndex > flashcards.length - 1
                    ? cardIndex
                    : backCardIndex
                ].question
              }
            </Text>
          </View>
        </View>
      )}
      {/* bottom buttons */}
      <View style={styles.footer}>
        <Pressable style={styles.undoButton} onPress={handleUndo}>
          <MaterialIcon
            name={"undo"}
            size={42}
            color={Dark.secondary}
          ></MaterialIcon>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Dark.background,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  cardContainer: {
    width: 300,
    height: 420,
    alignSelf: "center",
    marginTop: SCREEN_HEIGHT * 0.17,
    backgroundColor: "transparent",
    position: "absolute",
  },
  card: {
    padding: 15,
    borderRadius: 25,
    backgroundColor: Dark.quatrenary,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
    borderWidth: 2,
    borderColor: Dark.quatrenary,
  },
  backCard: {
    position: "absolute",
    top: 0,
  },
  cardText: {
    color: Dark.primary,
  },
  heading: {
    alignSelf: "center",
    color: Dark.primary,
    fontSize: 20,
    lineHeight: 38,
    fontFamily: "Poppins",
  },
  header: {
    paddingVertical: 20,
    backgroundColor: Dark.header,
    textAlignVertical: "center",
    alignItems: "flex-start",
    borderBottomColor: "#858585",
    width: "100%",
    borderBottomWidth: 2,
    flexDirection: "row",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    alignSelf: "flex-end",
    width: "100%",
    height: 100,
  },
  undoButton: {
    marginHorizontal: 25,
  },
});

export default NotebookScreen;
