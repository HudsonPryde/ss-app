import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import env from '../env';
import { Audio } from 'expo-av';
import Voice from '@react-native-voice/voice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dark, Notebook } from '../lib/Theme';
import { MaterialIcons } from '@expo/vector-icons';
import { ProgressBar, Snackbar } from 'react-native-paper';

const screenHeight = Dimensions.get('screen').height;

const AudioScreen = ({ navigation, route }) => {
  const { initText } = route.params;
  const [isRecording, setIsRecording] = useState(false);
  const [permission, requestPermission] = Audio.usePermissions();
  const [currentResults, setCurrentResults] = useState([]);
  const [totalResults, setTotalResults] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  const scale = useSharedValue(0);
  const wave = useSharedValue(0);

  // set initial text if it exists
  useEffect(() => {
    if (initText) {
      const truncatedText = initText.slice(0, 4000);
      setTotalResults([truncatedText]);
    }
  }, [initText]);

  useEffect(() => {
    const voiceControl = async () => {
      if (isRecording) {
        await Voice.start('en-US');
      } else {
        // add curr res to all res when recording stops
        setTotalResults([...totalResults, ...currentResults]);
        // clear current res
        setCurrentResults([]);
        await Voice.stop();
        await Voice.destroy();
      }
    };
    voiceControl();
  }, [isRecording]);

  // open text drawer if recording or result not empty
  useEffect(() => {
    if (isRecording || totalResults.length > 0) {
      scale.value = withTiming(1, { duration: 500 });
    } else {
      scale.value = withTiming(0, { duration: 500 });
    }
  }, [isRecording, totalResults]);

  // record button listening animation
  useEffect(() => {
    if (isRecording) {
      wave.value = withRepeat(
        withTiming(1, { duration: 1000 }),
        -1,
        false,
        () => {
          wave.value = withTiming(0, { duration: 0 });
        }
      );
    } else {
      wave.value = withTiming(0, { duration: 0 });
    }
  }, [isRecording]);

  useEffect(() => {
    let displayText = '';
    if (totalResults.length > 0) {
      displayText = totalResults.join('\n\n') + '\n\n';
    }
    displayText += currentResults.join(' ');
    // truncate text to 4000 characters
    const truncatedText = displayText.slice(0, 4000);
    setText(truncatedText);
  }, [totalResults, currentResults]);

  Voice.onSpeechResults = (e) => {
    console.log(e);
    setCurrentResults(e.value);
  };

  // stop recording if text is too long
  useEffect(() => {
    if (isRecording && text.length >= 4000) {
      setIsRecording(false);
    }
  }, [isRecording, text]);

  const handleEdit = () => {
    navigation.navigate('TextEdit', {
      initText: text,
    });
  };

  async function handleCreateNotes() {
    try {
      setIsRecording(false);
      setLoading(true);
      const notes = await createNotes(text);
      // const notes = ["note 1", "note 2", "note 3"];
      // after creation format strings into objects
      const formattedNotes = notes.map((note) => {
        return {
          text: note,
        };
      });
      setLoading(false);
      navigation.navigate('Notes', {
        notes: formattedNotes,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setApiError(true);
    }
  }

  const textContainerStyle = useAnimatedStyle(() => {
    const height = interpolate(scale.value, [0, 1], [0, screenHeight * 0.65]);
    return {
      height: height,
    };
  });

  const micBorderWaveStyle = useAnimatedStyle(() => {
    const size = interpolate(wave.value, [0, 1], [100, 200]);
    const opacity = interpolate(wave.value, [0, 1], [1, 0]);
    return {
      width: size,
      height: size,
      opacity: opacity,
    };
  });

  if (!permission?.granted) {
    // Mic permissions are not granted yet
    requestPermission();
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: Dark.tertiary,
          padding: 15,
        }}
      >
        <Text
          style={{
            color: Dark.primary,
            textAlign: 'center',
            fontFamily: 'inter',
            fontSize: 18,
          }}
        >
          We need your permission to use your microphone
        </Text>
        <TouchableOpacity
          style={{
            padding: 15,
            borderRadius: 15,
            backgroundColor: Dark.info,
            width: 200,
            height: 50,
            alignSelf: 'center',
            marginTop: 15,
          }}
          onPress={requestPermission}
        >
          <Text style={{ color: Dark.tertiary, textAlign: 'center' }}>
            Grant permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <Animated.View style={styles.micContainer} opacity={loading ? 0.5 : 1}>
        <Pressable
          style={styles.micButton}
          disabled={text.length >= 4000}
          onPress={() => {
            setIsRecording(!isRecording);
          }}
        >
          {isRecording && (
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  height: 100,
                  width: 100,
                  borderRadius: 100,
                  backgroundColor: '#6A4195',
                },
                micBorderWaveStyle,
              ]}
            ></Animated.View>
          )}
          <MaterialIcons
            name={isRecording ? 'mic' : 'mic-off'}
            size={65}
            color={'white'}
          />
        </Pressable>
      </Animated.View>
      <Animated.View
        style={[
          {
            backgroundColor: Dark.tertiary,
            width: '100%',
            borderTopStartRadius: 15,
            borderTopEndRadius: 15,
          },
          textContainerStyle,
        ]}
        opacity={loading ? 0.5 : 1}
        // layout={SequencedTransition}
      >
        <View style={styles.topRow}>
          <Text style={styles.text}>{text.length}/4000</Text>
          <Pressable
            style={styles.clearButton}
            onPress={() => {
              setCurrentResults([]);
              setTotalResults([]);
              setText('');
            }}
          >
            <Text
              style={[
                styles.text,
                {
                  fontSize: 14,
                  lineHeight: 18,
                  color: Dark.quatrenary,
                },
              ]}
            >
              Clear
            </Text>
            <MaterialIcons name="close" size={20} color={Dark.tertiary} />
          </Pressable>
        </View>
        <ScrollView
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={{ padding: 20 }}
          bounces={false}
        >
          <Text style={styles.text}>{text}</Text>
        </ScrollView>
        <View style={styles.bottomButtons}>
          <Pressable
            style={styles.editButton}
            onPress={() => {
              setIsRecording(false);
              handleEdit();
            }}
          >
            <MaterialIcons name="edit" size={20} color={Dark.secondary} />
            <Text
              style={[
                styles.text,
                {
                  fontSize: 16,
                  lineHeight: 22,
                  textAlignVertical: 'center',
                  color: Dark.secondary,
                  fontFamily: 'Poppins',
                },
              ]}
            >
              Edit
            </Text>
          </Pressable>
          <Pressable
            style={styles.createButton}
            onPress={() => {
              if (Ad.isLoaded) {
                Ad.show();
              } else {
                handleCreateNotes();
              }
            }}
          >
            <Text
              style={[
                styles.text,
                {
                  fontSize: 16,
                  lineHeight: 22,
                  textAlignVertical: 'center',
                  color: Dark.secondary,
                  fontFamily: 'Poppins',
                  width: 100,
                },
              ]}
            >
              Make notes
            </Text>
            <MaterialIcons name="add" size={20} color={Dark.secondary} />
          </Pressable>
        </View>
      </Animated.View>
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
              One moment generating notes...
            </Text>
            <ProgressBar
              indeterminate={true}
              color={Dark.info}
              style={{ width: 200, height: 5, marginVertical: 10 }}
            />
          </View>
        </View>
      </Modal>
      <Snackbar
        visible={apiError}
        onDismiss={() => {
          setApiError(false);
        }}
        theme={{ colors: { background: Dark.alert } }}
        style={{
          backgroundColor: Dark.alert,
          borderRadius: 10,
          color: Dark.tertiary,
        }}
        duration={3000}
        elevation={5}
      >
        <Text
          style={{
            color: Dark.tertiary,
            textAlign: 'center',
            fontFamily: 'inter',
            fontSize: 18,
          }}
        >
          Uh oh! Something went wrong. Please try again later.
        </Text>
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Dark.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  text: {
    fontFamily: 'PoppinsRegular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 30,
    color: Dark.primary,
  },
  micContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Notebook.grape,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
    width: 75,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
    width: 125,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: Dark.secondary,
    height: 25,
    width: 75,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
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
});

export default AudioScreen;
