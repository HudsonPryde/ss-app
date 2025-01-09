import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import { Dark } from '../lib/Theme';
import env from '../env';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { createFlashcards } from '../lib/api/textProcess';
import { bulkInsertFlashcards } from '../dao/flashcards';
import { useNotes } from '../provider/NotesProvider';
import {
  useFlashcards,
  useFlashcardsDispatch,
} from '../provider/FlashcardsProvider';
import { ProgressBar } from 'react-native-paper';

const FlashcardOptionsScreen = ({ navigation, route }) => {
  const { sections, notebook } = route.params;
  const notes = useNotes();
  const flashcards = useFlashcards();
  const flashcardsDispatch = useFlashcardsDispatch();
  const [selectedSections, setSelectedSections] = useState([]);
  const [sectionNotes, setSectionNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flashcardGenProgress, setFlashcardGenProgress] = useState(0);

  useEffect(() => {
    setSectionNotes(
      notes.filter((n) => selectedSections.includes(n.section_id))
    );
  }, [selectedSections]);

  async function handleSubmitOptions() {
    // create a list of promises representing the flashcards being made
    // await the flashcards being made
    setLoading(true);
    const { existingFlashcards, newFlashcards } = await makeFlashcards(
      sectionNotes
    );
    const createdFlashcards = await handleAddToDB(newFlashcards);
    setLoading(false);
    sendToFlashcards([...existingFlashcards, ...createdFlashcards]);
  }

  function sendToFlashcards(data) {
    navigation.goBack();
    navigation.navigate('Flashcards', {
      notes: sectionNotes,
      flashcards: data,
      notebook: notebook,
    });
  }

  async function handleAddToDB(flashcards) {
    try {
      const response = await bulkInsertFlashcards(flashcards);
      if (response.error) {
        console.log(response.error);
        return;
      }
      flashcardsDispatch({ type: 'bulkAdded', flashcards: response });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function makeFlashcards(notes) {
    try {
      let newFlashcards = [];
      let premadeFlashcards = [];
      let index = 0;
      for (const note of notes) {
        const existingFlashcards = flashcards.filter(
          (f) => f.note_id === note.id
        );
        if (existingFlashcards.length > 0) {
          premadeFlashcards.push(existingFlashcards);
        } else {
          // if no flashcards exist for this note create them
          newFlashcards.push(await createFlashcards(note));
        }
        index++;
        setFlashcardGenProgress(index / notes.length);
      }
      return {
        existingFlashcards: premadeFlashcards.flat(4),
        newFlashcards: newFlashcards.flat(4),
      };
    } catch (error) {
      console.log(error);
    }
  }

  const notebookSections = () =>
    sections.map(({ id, name }) => {
      return (
        <Pressable
          key={id}
          onPress={() => {
            if (selectedSections.includes(id)) {
              setSelectedSections(
                selectedSections.filter((sectionId) => sectionId !== id)
              );
            } else {
              setSelectedSections([...selectedSections, id]);
            }
          }}
          style={
            selectedSections.includes(id)
              ? styles.selectedSectionButton
              : styles.sectionButton
          }
        >
          <MaterialIcon
            name={
              selectedSections.includes(id)
                ? 'check-box'
                : 'check-box-outline-blank'
            }
            size={24}
            color={Dark.primary}
            style={styles.checkBox}
          />
          <Text style={styles.text}>{name}</Text>
        </Pressable>
      );
    });

  return (
    <View style={styles.container} opacity={loading ? 0.5 : 1}>
      <View
        style={{
          width: 100,
          height: 5,
          backgroundColor: Dark.primary,
          marginVertical: 10,
          borderRadius: 25,
        }}
      />
      <View style={styles.header}>
        <Text style={styles.heading}>Select sections</Text>
        <Pressable
          disabled={selectedSections.length <= 0}
          opacity={selectedSections.length <= 0 ? 0.5 : 1}
          onPress={() => {
            handleSubmitOptions();
          }}
        >
          <Text style={[styles.text, { color: Dark.info }]}>Done</Text>
        </Pressable>
      </View>
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
        }}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {notebookSections()}
      </ScrollView>
      {/* modal to display loading animation */}
      <Modal animationType="fade" transparent visible={loading}>
        <View style={[styles.modalContainer]}>
          <View style={styles.loadingBox}>
            <Text
              style={[
                styles.text,
                { color: Dark.primary, textAlign: 'center' },
              ]}
            >
              Hang tight making flashcards...
            </Text>
            <ProgressBar
              progress={flashcardGenProgress}
              color={notebook.colour}
              style={{ width: 200, height: 5, marginVertical: 10 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Dark.background,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    width: '100%',
    borderBottomColor: Dark.tertiary,
    justifyContent: 'space-between',
  },
  heading: {
    fontFamily: 'PoppinsRegular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 32,
    color: Dark.secondary,
  },
  text: {
    fontFamily: 'PoppinsRegular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 30,
    color: Dark.primary,
  },
  sectionButton: {
    justifyContent: 'flex-start',
    backgroundColor: Dark.quatrenary,
    width: '90%',
    height: 50,
    borderRadius: 15,
    marginVertical: 10,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  selectedSectionButton: {
    justifyContent: 'flex-start',
    backgroundColor: Dark.tertiary,
    width: '90%',
    height: 50,
    borderRadius: 15,
    marginVertical: 10,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkBox: {
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: Dark.info,
    width: '80%',
    height: 50,
    borderRadius: 25,
    marginBottom: 50,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadingBox: {
    height: 150,
    width: 250,
    backgroundColor: Dark.tertiary,
    borderRadius: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

export default FlashcardOptionsScreen;
