import { createContext, useContext, useReducer, useEffect } from "react";

const ScanContext = createContext(null);

const ScanDispatchContext = createContext(null);

export function ScanProvider({ children }) {
  const [scan, dispatch] = useReducer(scanReducer, "");

  return (
    <ScanContext.Provider value={scan}>
      <ScanDispatchContext.Provider value={dispatch}>
        {children}
      </ScanDispatchContext.Provider>
    </ScanContext.Provider>
  );
}

export function useScan() {
  return useContext(ScanContext);
}

export function useScanDispatch() {
  return useContext(ScanDispatchContext);
}

function scanReducer(scan, action) {
  switch (action.type) {
    case "edited": {
      return action.scan;
    }
    case "cleared": {
      return "";
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
