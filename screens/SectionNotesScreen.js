import React, { useState, useEffect } from 'react';
import { Dark } from '../lib/Theme';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  ZoomIn,
  ZoomOut,
  FadeIn,
  Easing,
  LinearTransition,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { removeNotes, createNote } from '../dao/notes';
import { useNotes, useNotesDispatch } from '../provider/NotesProvider';
import { useFlashcards } from '../provider/FlashcardsProvider';
import { TextInput } from 'react-native-gesture-handler';

const SectionNotesScreen = ({ route, navigation }) => {
  const notes = useNotes();
  const flashcards = useFlashcards();
  const dispatch = useNotesDispatch();
  const { sectionId, sectionName } = route.params;
  const [editMode, setEditMode] = useState(false);
  const [darken, setDarken] = useState(false);
  const [notesList, setNotesList] = useState([]);
  const [removedNotes, setRemovedNotes] = useState([]);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    setNotesList(notes?.filter((note) => note.section_id === sectionId));
  }, [notes]);

  const handleSave = async () => {
    await removeNotes(removedNotes);
    dispatch({
      type: 'bulkRemoved',
      ids: notesList
        .filter((note) => removedNotes.includes(note.id))
        .map((note) => note.id),
    });
    setEditMode(false);
    setRemovedNotes([]);
  };

  const handleCancel = () => {
    setEditMode(false);
    setRemovedNotes([]);
  };

  const handleAddNote = async () => {
    const note = await createNote({ text: noteText, section_id: sectionId });
    dispatch({
      type: 'added',
      id: note.id,
      section_id: note.section_id,
      text: note.text,
      created_at: note.created_at,
    });
    setNoteText('');
  };

  const noteComponents = notesList.map((note, index) => {
    if (!removedNotes.includes(note.id)) {
      return (
        <Animated.View
          key={note.id}
          style={[styles.note]}
          // entering={ZoomIn}
          exiting={ZoomOut}
          itemLayoutAnimation={LinearTransition}
        >
          {editMode && (
            <Animated.View
              // entering={ZoomIn}
              exiting={ZoomOut}
              style={{
                alignSelf: 'flex-end',
                position: 'absolute',
                right: 15,
                top: 10,
              }}
            >
              <Pressable
                onPress={() => {
                  setRemovedNotes([...removedNotes, note.id]);
                }}
              >
                <MaterialIcon name="remove" size={24} color={Dark.primary} />
              </Pressable>
            </Animated.View>
          )}
          <Text style={styles.text}>{note.text}</Text>
        </Animated.View>
      );
    }
  });

  const editButton = (
    <Animated.View entering={FadeIn}>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: 60,
          justifyContent: 'space-between',
        }}
        onPress={() => setEditMode(!editMode)}
      >
        <MaterialIcon
          size={22}
          name={'edit'}
          color={Dark.secondary}
        ></MaterialIcon>
        <Text style={[styles.heading, { fontSize: 16 }]} color={Dark.secondary}>
          Edit
        </Text>
      </Pressable>
    </Animated.View>
  );

  const confirmButtons = (
    <Animated.View style={styles.segmentedButtons} entering={FadeIn}>
      <Pressable
        style={styles.optionButton}
        onPress={() => {
          handleCancel();
        }}
      >
        <Text
          style={[
            styles.optionsText,
            {
              borderRightColor: Dark.background,
              borderRightWidth: 1,
            },
          ]}
        >
          Cancel
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.optionButton,
          { borderLeftColor: Dark.background, borderLeftWidth: 1 },
        ]}
        onPress={handleSave}
      >
        <Text style={[styles.optionsText]}>Save</Text>
      </Pressable>
    </Animated.View>
  );

  const addNoteModal = (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAddNoteModal}
      onRequestClose={() => {
        setShowAddNoteModal(!showAddNoteModal);
      }}
    >
      <SafeAreaView
        style={[
          styles.note,
          {
            flex: 1,
            borderWidth: 1,
            borderColor: Dark.secondary,
            marginTop: '15%',
            paddingTop: 15,
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 60,
              justifyContent: 'space-between',
            }}
            onPress={() => {
              setShowAddNoteModal(!showAddNoteModal);
            }}
          >
            <Text
              style={[styles.heading, { fontSize: 16 }]}
              color={Dark.secondary}
            >
              Close
            </Text>
          </Pressable>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 60,
              justifyContent: 'space-between',
            }}
            onPress={() => {
              handleAddNote();
              setShowAddNoteModal(!showAddNoteModal);
            }}
          >
            <Text style={[styles.heading, { fontSize: 16, color: Dark.info }]}>
              Add
            </Text>
          </Pressable>
        </View>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <TextInput
            style={[
              styles.text,
              { flex: 1, lineHeight: 23, textAlignVertical: 'top' },
            ]}
            autoFocus={true}
            placeholder="Enter note text"
            placeholderTextColor={Dark.secondary}
            onChangeText={(text) => setNoteText(text)}
            value={noteText}
            multiline={true}
            numberOfLines={4}
          ></TextInput>
        </GestureHandlerRootView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView
      style={styles.container}
      opacity={darken ? 0.5 : 1}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <MaterialIcon
            size={28}
            name={'chevron-left'}
            color={Dark.secondary}
          ></MaterialIcon>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'flex-start',
          }}
        >
          <MaterialIcon
            size={22}
            name={'folder-open'}
            color={Dark.secondary}
          ></MaterialIcon>
          <Text style={styles.heading} color={Dark.secondary} numberOfLines={1}>
            {sectionName}
          </Text>
        </View>
        {!editMode && editButton}
        {editMode && confirmButtons}
      </View>
      <Animated.FlatList
        data={noteComponents}
        renderItem={({ item }) => item}
        itemLayoutAnimation={LinearTransition}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        ListHeaderComponent={() => {
          {
            /* new note button */
          }
          return (
            !editMode && (
              <Animated.View>
                <Pressable
                  onPress={() => setShowAddNoteModal(true)}
                  style={styles.newNoteButton}
                >
                  <MaterialIcon name="add" size={24} color={Dark.secondary} />
                </Pressable>
              </Animated.View>
            )
          );
        }}
      />
      {addNoteModal}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: Dark.background,
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontFamily: 'PoppinsRegular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 30,
    color: Dark.primary,
  },
  header: {
    flexDirection: 'row',
    // paddingHorizontal: 15,
    paddingVertical: 15,
    elevation: 5,
    zIndex: 5,
    shadowColor: Dark.background,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 25,
    alignItems: 'center',
    backgroundColor: Dark.background,
    justifyContent: 'space-between',
    width: '90%',
  },
  heading: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 38,
    width: 200,
    marginHorizontal: 10,
    color: Dark.primary,
  },
  note: {
    width: Dimensions.get('window').width - 20,
    margin: 15,
    padding: 25,
    borderRadius: 15,
    backgroundColor: Dark.quatrenary,
  },
  scrollContainer: {
    width: '100%',
    height: '100%',
  },
  scrollContentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  optionButton: {
    padding: 5,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsText: {
    fontFamily: 'PoppinsRegular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 30,
    color: Dark.primary,
  },
  segmentedButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: 150,
    borderRadius: 15,
    backgroundColor: Dark.tertiary,
  },
  newNoteButton: {
    width: Dimensions.get('window').width - 20,
    margin: 15,
    padding: 25,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: Dark.secondary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 75,
  },
});

export default SectionNotesScreen;
