import { createContext, useContext, useReducer, useEffect } from "react";
import { getSectionNotes } from "../dao/notes";
import { useSections } from "./SectionsProvider";
import { AuthContext } from "./AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotesContext = createContext(null);

const NotesDispatchContext = createContext(null);

export function NotesProvider({ children }) {
  const { user } = useContext(AuthContext);
  const sections = useSections();
  const [notes, dispatch] = useReducer(notesReducer, []);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        const data = await getSectionNotes(sections.map((s) => s.id));
        dispatch({ type: "initialised", notes: data });
      } else {
        const data = await AsyncStorage.getItem("notes");
        if (data) {
          dispatch({
            type: "initialised",
            notes: data ? JSON.parse(data) : [],
          });
        }
      }
    }
    fetchData();
  }, [sections]);

  return (
    <NotesContext.Provider value={notes}>
      <NotesDispatchContext.Provider value={dispatch}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}

export function useNotesDispatch() {
  return useContext(NotesDispatchContext);
}

function notesReducer(notes, action) {
  switch (action.type) {
    case "initialised": {
      return action.notes;
    }
    case "added": {
      return [
        {
          id: action.id,
          section_id: action.section_id,
          created_at: action.created_at,
          text: action.text,
        },
        ...notes,
      ];
    }
    case "updated": {
      return notes.map((n) => {
        if (n.id === action.note.id) {
          return action.note;
        } else {
          return n;
        }
      });
    }
    case "removed": {
      return notes.filter((s) => s.id !== action.id);
    }
    case "bulkRemoved": {
      return notes.filter((s) => !action.ids.includes(s.id));
    }
    case "bulkAdded": {
      return [...action.notes, ...notes];
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
