import React, { useState, useRef, useEffect, useContext } from 'react';
import { useCameraPermissions, CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import { useScan, useScanDispatch } from '../provider/ScanProvider';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  Button,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { Dark, Notebook } from '../lib/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../provider/AuthProvider';
import MlkitOcr from 'react-native-mlkit-ocr';
import CropScreen from './CropScreen';
import * as ScreenOrientation from 'expo-screen-orientation';

SCREEN_HEIGHT = Dimensions.get('window').height;
SCREEN_WIDTH = Dimensions.get('window').width;

const CameraScreen = ({ navigation, route }) => {
  const { session, user } = useContext(AuthContext);
  const scan = useScan();
  const dispatch = useScanDispatch();
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentBoundingBoxes, setCurrentBoundingBoxes] = useState([]);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermision, requestMediaPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [flashMode, setFlashMode] = useState('off');
  const [cameraLayout, setCameraLayout] = useState(null);
  const [showBoundings, setShowBoundings] = useState(false);
  const [emitScan, setEmitScan] = useState(false);
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const unlock = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
    unlock();
  }, []);

  const [cropLayout, setCropLayout] = useState({
    height: 0,
    width: 0,
    pageX: 0,
    pageY: 0,
  });

  // TODO: add bounding box animation to show what was scanned

  function fitWidth(value, imageWidth) {
    return (value / imageWidth) * cameraLayout.width;
  }

  function fitHeight(value, imageHeight) {
    return (value / imageHeight) * cameraLayout.height;
  }

  const handleImageCapture = async () => {
    setCameraReady(false);
    setEmitScan(true);
    cameraRef.current.pausePreview();
    const res = await cameraRef.current.takePictureAsync({ exif: true });
    console.log(orientation);
    const crop = orientation.includes('portrait')
      ? {
          height: (cropLayout.height / SCREEN_HEIGHT) * res.height,
          originX: (cropLayout.pageX / SCREEN_WIDTH) * res.width,
          originY: (cropLayout.pageY / (SCREEN_HEIGHT - 82)) * res.height,
          width: (cropLayout.width / SCREEN_WIDTH) * res.width,
        }
      : {
          height: (cropLayout.width / SCREEN_WIDTH) * res.height,
          originX: (cropLayout.pageY / SCREEN_WIDTH) * res.height,
          originY: (cropLayout.pageX / (SCREEN_HEIGHT - 82)) * res.width,
          width: (cropLayout.height / SCREEN_HEIGHT) * res.width,
        };
    // find actual placement of crop on the image
    // - 82 to account for bottom bar + border
    const image = await ImageManipulator.manipulateAsync(
      res.uri,
      [
        {
          crop: crop,
        },
      ],
      {
        compress: 1,
        format: 'png',
      }
    );

    const ocrResult = await MlkitOcr.detectFromUri(image.uri);
    setCurrentImage(image);
    setCurrentBoundingBoxes(ocrResult);
    handleImageCaptureResults(ocrResult);
    // setShowBoundings(true);
    // Animated.stagger(1000, [fadeinBoxAnimation, fadeoutBoxAnimation]);
  };

  const handleImageCaptureResults = (ocrResult) => {
    const text = retrieveScannedText(ocrResult);
    setEmitScan(false);
    dispatch({ type: 'edited', scan: text });
    navigation.navigate('ScannedText');
    cameraRef.current.resumePreview();
    setCameraReady(true);
  };

  const handleImageImport = async (image) => {
    const ocrResult = await MlkitOcr.detectFromUri(image.uri);
    setCurrentImage(image);
    handleImageCaptureResults(ocrResult);
    // setShowBoundings(true);
    // Animated.stagger(1000, [fadeinBoxAnimation, fadeoutBoxAnimation]);
  };

  const retrieveScannedText = (boxes) => {
    let text = scan;
    boxes.forEach((box) => {
      text += box.text + ' ';
    });
    if (text.length > 4000) {
      text = text.substring(0, 4000);
    }
    return text;
  };

  const boundingBoxes = currentBoundingBoxes.map((box, index) => {
    return (
      <View
        key={index}
        style={{
          top: fitHeight(box.bounding.top, currentImage?.height ?? 0),
          left: fitWidth(box.bounding.left, currentImage?.width ?? 0),
          height: fitHeight(box.bounding.height, currentImage?.height ?? 0),
          width: fitWidth(box.bounding.width, currentImage?.width ?? 0),
          position: 'absolute',
          borderColor: 'gold',
          borderWidth: 1,
          borderStyle: 'dashed',
          borderRadius: 15,
        }}
      ></View>
    );
  });

  const cameraButton = (
    <View style={styles.row}>
      {/* CAMERA BUTTON */}
      <View style={{ flex: 1 }} />
      <View
        style={{
          backgroundColor: '#6A4195',
          borderRadius: 50,
          padding: 20,
          marginVertical: 15,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.35,
          shadowRadius: 3.84,
        }}
      >
        <TouchableOpacity
          disabled={!cameraReady}
          onPress={async () => {
            handleImageCapture();
            // navigation.navigate("ImageCrop");
          }}
        >
          <MaterialIcons
            name={'center-focus-weak'}
            size={45}
            style={{ color: 'white' }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.scannedTextButton}>
        <View style={[styles.pillConatiner, { marginTop: 25 }]}>
          {/* edit scanned text button */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ScannedText');
            }}
          >
            <MaterialIcons
              name={'notes'}
              size={28}
              style={{ color: 'white' }}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.text, { color: Dark.primary, fontSize: 12 }]}>
          Scanned text
        </Text>
      </View>
    </View>
  );

  const topButtons = (
    <View style={styles.row}>
      {/* container for flashlight and image library buttons */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <View style={styles.pillConatiner}>
          {/* Flash light toggle */}
          <TouchableOpacity
            onPress={() => {
              if (flashMode === 'off') {
                setFlashMode('on');
              } else {
                setFlashMode('off');
              }
            }}
          >
            <MaterialIcon
              name={flashMode == 'off' ? 'flash-off' : 'flash-on'}
              size={25}
              style={{ color: 'white' }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.pillConatiner}>
          {/* Media Library icon */}
          <TouchableOpacity
            onPress={async () => {
              res = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                allowsMultipleSelection: false,
                quality: 1,
              });
              if (!res.canceled) {
                const img = res.assets[0];
                // after successful upload navigate to notes screen
                handleImageImport(img);
              }
            }}
          >
            <MaterialIcon
              name={'photo-library'}
              size={25}
              style={{
                color: 'white',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (!permission || !mediaPermision) {
    return <View></View>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
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
          We need your permission to show the camera
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
    <CameraView
      onCameraReady={() => {
        setCameraReady(true);
      }}
      facing={'back'}
      ref={cameraRef}
      flash={flashMode}
      responsiveOrientationWhenOrientationLocked={true}
      onResponsiveOrientationChanged={(e) => {
        setOrientation(e.orientation);
      }}
      onLayout={(e) => {
        setCameraLayout(e.nativeEvent.layout);
      }}
    >
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.camera}>
        {/* camera preview */}
        {topButtons}
        <View
          style={{
            flex: 1,
            zIndex: -1,
            paddingBottom: 80,
          }}
        >
          <CropScreen
            emitCropLayout={(crop) => {
              setCropLayout(crop);
            }}
            startScan={emitScan}
          />
        </View>
        {cameraButton}
      </SafeAreaView>

      {/* results image */}
      {showBoundings ? (
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]}
        >
          {boundingBoxes}
        </Animated.View>
      ) : null}
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size={'large'} color={Dark.primary} />
        </View>
      ) : null}
    </CameraView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    fontFamily: 'PoppinsRegular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 30,
    color: Dark.primary,
  },
  text: {
    fontFamily: 'PoppinsRegular',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 30,
    color: Dark.primary,
  },
  floatingButton: {
    borderRadius: 50,
    opacity: 0.75,
    backgroundColor: Dark.secondary,
    alignSelf: 'center',
    padding: 5,
    margin: 5,
  },
  textDrawer: {
    flexDirection: 'row',
    width: Dimensions.get('screen').width,
    height: '85%',
    backgroundColor: Dark.tertiary,
    borderRadius: 10,
    paddingVertical: 15,
  },
  textField: {
    borderRadius: 10,
    backgroundColor: Dark.quatrenary,
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  loadingIndicator: {
    alignSelf: 'center',
    height: 5,
    width: '100%',
    borderRadius: 15,
    backgroundColor: Dark.info,
  },
  clearButton: {
    backgroundColor: Dark.secondary,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  pillConatiner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 5,
    padding: 15,
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  makeNotesButton: {
    backgroundColor: Notebook.cerulean,
    borderRadius: 25,
    paddingHorizontal: 5,
    marginTop: 15,
    width: '100%',
    height: 35,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedTextButton: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
});

export default CameraScreen;
