import { createContext, useContext, useReducer, useEffect } from "react";
import { getBulkSections } from "../dao/notebookSections";
import { useNotebooks } from "./NotebookProvider";
import { AuthContext } from "./AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SectionsContext = createContext(null);

const SectionsDispatchContext = createContext(null);

export function SectionsProvider({ children }) {
  const { user } = useContext(AuthContext);
  const notebooks = useNotebooks();
  const [sections, dispatch] = useReducer(sectionsReducer, null);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        const data = await getBulkSections(notebooks.map((n) => n.id));
        dispatch({ type: "initialised", sections: data });
      } else {
        const data = await AsyncStorage.getItem("sections");
        if (data) {
          dispatch({
            type: "initialised",
            sections: data ? JSON.parse(data) : [],
          });
        }
      }
    }
    fetchData();
  }, [notebooks]);

  return (
    <SectionsContext.Provider value={sections}>
      <SectionsDispatchContext.Provider value={dispatch}>
        {children}
      </SectionsDispatchContext.Provider>
    </SectionsContext.Provider>
  );
}

export function useSections() {
  return useContext(SectionsContext);
}

export function useSectionsDispatch() {
  return useContext(SectionsDispatchContext);
}

function sectionsReducer(sections, action) {
  switch (action.type) {
    case "initialised": {
      return action.sections;
    }
    case "added": {
      return [
        {
          id: action.id,
          notebook_id: action.notebook_id,
          created_at: action.created_at,
          name: action.name,
        },
        ...sections,
      ];
    }
    case "updated": {
      return sections.map((s) => {
        if (s.id === action.section.id) {
          return action.section;
        } else {
          return s;
        }
      });
    }
    case "removed": {
      return sections.filter((s) => s.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
