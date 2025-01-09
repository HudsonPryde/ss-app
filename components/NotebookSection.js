import React, { useState, useEffect, useRef } from 'react';
import { Dark } from '../lib/Theme';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  LayoutAnimation,
  UIManager,
  Modal,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSections, useSectionsDispatch } from '../provider/SectionsProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { removeSection, renameSection } from '../dao/notebookSections';
import {
  GestureHandlerRootView,
  TextInput,
} from 'react-native-gesture-handler';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NotebookSection = ({ id, requestDarken }) => {
  const navigation = useNavigation();
  const sections = useSections();
  const dispatch = useSectionsDispatch();
  const section = sections?.find((sect) => sect.id == id);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [rename, setRename] = useState(false);
  const [sectionName, setSectionName] = useState(section?.name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (showOptionModal) {
      requestDarken(true);
    } else {
      requestDarken(false);
    }
  }, [showOptionModal]);

  const handleRemoveSection = async () => {
    try {
      setShowOptionModal(false);
      await removeSection(section?.id);
      dispatch({ type: 'removed', id: section?.id });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameSection = async () => {
    try {
      await renameSection(section?.id, sectionName);
      dispatch({
        type: 'updated',
        section: { ...section, name: sectionName },
      });
      setShowOptionModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 250);
  };

  return (
    <View style={{ width: '100%' }}>
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            navigation.navigate('SectionNotes', {
              sectionId: section?.id,
              sectionName: section?.name,
            });
          }}
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <MaterialIcons
            name={'folder'}
            size={28}
            color={Dark.secondary}
            style={{ paddingHorizontal: 15 }}
          />
          {rename ? (
            <GestureHandlerRootView style={{ flex: 1 }}>
              <TextInput
                maxLength={20}
                keyboardAppearance={'dark'}
                ref={inputRef}
                enterKeyHint={'done'}
                returnKeyLabel={'done'}
                returnKeyType={'done'}
                value={sectionName}
                onChangeText={setSectionName}
                onBlur={() => {
                  setSectionName(section?.name);
                  setRename(false);
                }}
                onSubmitEditing={() => handleRenameSection()}
                style={[styles.text, { flex: 1, lineHeight: 23 }]}
              ></TextInput>
            </GestureHandlerRootView>
          ) : (
            <Text style={styles.text}>{section?.name}</Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => {
            setShowOptionModal(!showOptionModal);
          }}
        >
          <MaterialIcons name={'more-horiz'} size={22} color={Dark.secondary} />
        </Pressable>
      </View>
      {/* Section Options Modal */}
      <Modal visible={showOptionModal} animationType="slide" transparent={true}>
        <Pressable
          onPress={() => setShowOptionModal(false)}
          style={{ flex: 3 }}
        ></Pressable>
        <View style={[styles.optionsModal]}>
          <View
            style={[
              styles.optionsContainer,
              {
                marginBottom: 0,
                flexDirection: 'row',
                alignItems: 'center',
                padding: 15,
                height: 60,
              },
            ]}
          >
            <MaterialIcons
              name={'folder-open'}
              size={24}
              color={Dark.primary}
            />
            <Text style={[styles.text, { marginLeft: 15, fontSize: 20 }]}>
              {section?.name}
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            <Pressable
              style={styles.optionButton}
              onPress={() => {
                setRename(!rename);
                setShowOptionModal(false);
                focusInput();
              }}
            >
              <MaterialIcons name={'edit'} size={20} color={Dark.primary} />
              <Text style={[styles.text, { marginLeft: 15 }]}>Rename</Text>
            </Pressable>
            <Pressable
              style={styles.optionButton}
              onPress={() => handleRemoveSection()}
            >
              <MaterialIcons name={'delete'} size={20} color={Dark.alert} />
              <Text
                style={[
                  styles.text,
                  {
                    marginLeft: 15,
                    color: Dark.alert,
                  },
                ]}
              >
                Delete
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 15,
    gap: 5,
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  optionsContainer: {
    backgroundColor: '#242424',
    borderRadius: 15,
    flexDirection: 'column',
    margin: 25,
    height: 120,
    overflow: 'hidden',
  },
  optionButton: {
    borderBottomWidth: 3,
    borderBottomColor: Dark.tertiary,
    padding: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionsModal: {
    flex: 2,
    borderRadius: 15,
    backgroundColor: Dark.tertiary,
  },
  text: {
    fontFamily: 'PoppinsRegular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 30,
    color: Dark.primary,
    height: 30,
  },
  note: {
    width: 250,
    height: 130,
    marginLeft: 30,
    padding: 15,
    borderRadius: 15,
    backgroundColor: Dark.tertiary,
  },
});

export default NotebookSection;
