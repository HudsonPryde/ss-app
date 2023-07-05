import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
} from "react";
import { getStudySets } from "../dao/studySets";
import { AuthContext } from "./AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotebooksContext = createContext(null);

const NotebooksDispatchContext = createContext(null);

export function NotebooksProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [notebooks, dispatch] = useReducer(notebooksReducer, []);

  useEffect(() => {
    async function getNotebooks() {
      if (user) {
        const data = await getStudySets(user.id);
        dispatch({ type: "initialised", notebooks: data });
      } else {
        const data = await AsyncStorage.getItem("notebooks");
        if (data) {
          dispatch({ type: "initialised", notebooks: data });
        }
      }
    }
    getNotebooks();
  }, [user]);

  return (
    <NotebooksContext.Provider value={notebooks}>
      <NotebooksDispatchContext.Provider value={dispatch}>
        {children}
      </NotebooksDispatchContext.Provider>
    </NotebooksContext.Provider>
  );
}

export function useNotebooks() {
  return useContext(NotebooksContext);
}

export function useNotebooksDispatch() {
  return useContext(NotebooksDispatchContext);
}

function notebooksReducer(notebooks, action) {
  switch (action.type) {
    case "initialised": {
      return action.notebooks;
    }
    case "added": {
      return [
        {
          id: action.id,
          user_id: action.user_id,
          created_at: action.created_at,
          name: action.name,
          colour: action.colour,
        },
        ...notebooks,
      ];
    }
    case "updated": {
      return notebooks.map((n) => {
        if (n.id === action.notebook.id) {
          return action.notebook;
        } else {
          return n;
        }
      });
    }
    case "removed": {
      return notebooks.filter((n) => n.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

// const initialNotebooks = [
//   {
//     id: "fcd309be-2f59-4094-9089-f23b18d419ad",
//     user_id: "device",
//     created_at: "2021-08-01T00:00:00.000Z",
//     name: "First notebook",
//     colour: "red",
//   },
// ];
