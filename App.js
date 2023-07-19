import React from "react";
import { StatusBar } from "expo-status-bar";
import Navigation from "./navigation";
import { AuthProvider } from "./provider/AuthProvider";
import { NotebooksProvider } from "./provider/NotebookProvider";
import { SectionsProvider } from "./provider/SectionsProvider";
import { NotesProvider } from "./provider/NotesProvider";
import { FlashcardsProvider } from "./provider/FlashcardsProvider";
import { ScanProvider } from "./provider/ScanProvider";

export default function App() {
  return (
    <AuthProvider>
      <NotebooksProvider>
        <SectionsProvider>
          <NotesProvider>
            <FlashcardsProvider>
              <ScanProvider>
                <Navigation />
                <StatusBar style={"light"} />
              </ScanProvider>
            </FlashcardsProvider>
          </NotesProvider>
        </SectionsProvider>
      </NotebooksProvider>
    </AuthProvider>
  );
}
