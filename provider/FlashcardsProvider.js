import { createContext, useContext, useReducer, useEffect } from "react";
import { useNotes } from "./NotesProvider";
import { AuthContext } from "./AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFlashcardsFromNotes } from "../dao/flashcards";

const FlashcardsContext = createContext(null);

const FlashcardsDispatchContext = createContext(null);

export function FlashcardsProvider({ children }) {
  const { user } = useContext(AuthContext);
  const notes = useNotes();
  const [flashcards, dispatch] = useReducer(flashcardsReducer, []);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        const data = await getFlashcardsFromNotes(notes.map((n) => n.id));
        dispatch({ type: "initialised", flashcards: data });
      } else {
        const data = await AsyncStorage.getItem("flashcards");
        if (data) {
          dispatch({
            type: "initialised",
            flashcards: data ? JSON.parse(data) : [],
          });
        }
      }
    }
    fetchData();
  }, [notes]);

  return (
    <FlashcardsContext.Provider value={flashcards}>
      <FlashcardsDispatchContext.Provider value={dispatch}>
        {children}
      </FlashcardsDispatchContext.Provider>
    </FlashcardsContext.Provider>
  );
}

export function useFlashcards() {
  return useContext(FlashcardsContext);
}

export function useFlashcardsDispatch() {
  return useContext(FlashcardsDispatchContext);
}

function flashcardsReducer(flashcards, action) {
  switch (action.type) {
    case "initialised": {
      return action.flashcards;
    }
    case "added": {
      return [
        {
          id: action.id,
          question: action.question,
          created_at: action.created_at,
          answer: action.answer,
          times_correct: action.times_correct,
          note_id: action.note_id,
          times_incorrect: action.times_incorrect,
        },
        ...flashcards,
      ];
    }
    case "bulkAdded": {
      return [...action.flashcards, ...flashcards];
    }
    case "updated": {
      return flashcards.map((f) => {
        if (f.id === action.flashcard.id) {
          return action.flashcard;
        } else {
          return s;
        }
      });
    }
    case "bulkUpdated": {
      return flashcards.map((f) => {
        const updatedFlashcard = action.flashcards.find(
          (flashcard) => flashcard.id === f.id
        );
        if (updatedFlashcard) {
          return updatedFlashcard;
        } else {
          return f;
        }
      });
    }
    case "removed": {
      return flashcards.filter((f) => f.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
