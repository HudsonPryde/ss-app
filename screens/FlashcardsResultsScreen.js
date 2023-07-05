import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Dark } from "../lib/Theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, { BounceIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackActions } from "@react-navigation/native";

const FlashcardsResultsScreen = ({ navigation, route }) => {
  const { notebook, totalCards, incorrectCards } = route.params;
  const [notebookColour, setNotebookColor] = useState(notebook.colour);
  const [allCards, setAllCards] = useState(totalCards);
  const [missedCards, setMissedCards] = useState(incorrectCards);
  const score =
    missedCards.length > 0
      ? Math.floor(
          ((allCards.length - missedCards.length) / allCards.length) * 100
        )
      : 100;
  useEffect(() => {
    console.log(notebook, totalCards, incorrectCards);
    setAllCards(totalCards);
    setMissedCards(incorrectCards);
    setNotebookColor(notebook.colour);
  }, [notebook, totalCards, incorrectCards]);

  const scoreText = () => {
    if (score === 100) {
      return (
        <Text style={styles.resultText}>Wow! You scored {score}% Amazing!</Text>
      );
    } else if (score >= 80) {
      return (
        <Text style={styles.resultText}>You scored {score}% Great job!</Text>
      );
    } else if (score >= 60) {
      return (
        <Text style={styles.resultText}>You scored {score}% Good work!</Text>
      );
    } else {
      return (
        <Text style={styles.resultText}>You scored {score}% Keep at it!</Text>
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Animated.View entering={BounceIn}>
        <MaterialIcons name="check-circle" size={100} color={notebookColour} />
      </Animated.View>
      <View style={styles.resultContainer}>{scoreText()}</View>
      <Text style={styles.resultText}> Try again?</Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.button,
            { borderBottomWidth: 1, borderColor: Dark.quatrenary },
          ]}
          onPress={() => {
            navigation.dispatch({
              ...StackActions.replace("Flashcards", {
                flashcards: allCards,
                notebook: notebook,
              }),
              source: "FlashcardsResults",
            });
          }}
        >
          <Text style={[styles.text]}>All flashcards</Text>
        </Pressable>
        <Pressable
          disabled={missedCards.length === 0}
          opacity={missedCards.length === 0 ? 0.5 : 1}
          style={styles.button}
          onPress={() => {
            navigation.dispatch({
              ...StackActions.replace("Flashcards", {
                flashcards: missedCards,
                notebook: notebook,
              }),
              source: "FlashcardsResults",
            });
          }}
        >
          <Text style={[styles.text]}>Missed flashcards</Text>
        </Pressable>
      </View>
      <Text style={styles.text}>or</Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Notebook", { id: notebook.id })}
        >
          <Text style={[styles.text]}>Return to notebook</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Dark.background,
  },
  resultContainer: {
    marginVertical: 35,
    alignItems: "center",
    textAlign: "center",
    width: "80%",
  },
  buttonContainer: {
    flexDirection: "column",
    width: "80%",
    borderRadius: 15,
    marginVertical: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Dark.quatrenary,
  },
  button: {
    backgroundColor: Dark.tertiary,
    height: 50,
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 30,
    color: Dark.primary,
    textAlign: "center",
  },
  text: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 30,
    color: Dark.primary,
    textAlign: "center",
  },
});

export default FlashcardsResultsScreen;
