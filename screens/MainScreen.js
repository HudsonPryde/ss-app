import React, { useState, useRef, useEffect, useContext } from "react";
import { Dark } from "../lib/Theme";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Pressable,
  ActivityIndicator,
  UIManager,
  LayoutAnimation,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Notebook from "../components/Notebook";
import NotebookOptions from "../components/modals/NotebookOptions";
import NewNotebookModal from "../components/modals/NewNotebookModal";
import DeleteAccountModal from "../components/modals/DeleteAccountModal";
import { supabase } from "../lib/initSupabase";
import { AuthContext } from "../provider/AuthProvider";
import { useNotebooks } from "../provider/NotebookProvider";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { AdsConsent, AdsConsentStatus } from "react-native-google-mobile-ads";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MainScreen = ({ navigation }) => {
  const notebooks = useNotebooks();
  const { user } = useContext(AuthContext);
  const [showNotebookOptions, setShowNotebookOptions] = useState(false);
  const [showNewNotebook, setShowNewNotebook] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darken, setDarken] = useState(false);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const init = async () => {
      const consentInfo = await AdsConsent.requestInfoUpdate();
      await requestTrackingPermissionsAsync();
      if (
        consentInfo.isConsentFormAvailable &&
        consentInfo.status === AdsConsentStatus.REQUIRED
      ) {
        const { status } = await AdsConsent.showForm();
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (darken) {
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [darken]);

  const handleNotebookOptions = (id) => {
    setSelectedNotebook(notebooks.find((n) => n.id === id));
    setShowNotebookOptions(true);
    setDarken(true);
  };

  const noteSets = notebooks.map((data, index) => {
    return (
      <View
        key={index}
        style={{ marginBottom: 15 }}
        onLayout={() => {
          "Notebook rendered";
        }}
      >
        <Notebook
          id={data.id}
          triggerModal={(id) => handleNotebookOptions(id)}
        />
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <Animated.View
        style={{ width: "100%", height: "100%" }}
        opacity={fadeAnim}
      >
        <View style={styles.header}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.icon}>
              <Text
                style={[
                  styles.text,
                  {
                    color: "#FFFFF0",
                    fontSize: 20,
                    height: 40,
                    width: 40,
                    flex: 1,
                    textAlign: "center",
                    textAlignVertical: "center",
                    lineHeight: 38,
                  },
                ]}
              >
                {user ? user.email[0].toUpperCase() : "A"}
              </Text>
            </View>
            <Pressable
              style={{ flexDirection: "row" }}
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut
                );
                setShowUserOptions(!showUserOptions);
              }}
            >
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 16,
                    color: "#FFFFF0",
                    textAlignVertical: "center",
                    lineHeight: 38,
                    fontFamily: "PoppinsLight",
                    marginLeft: 10,
                  },
                ]}
              >
                {user ? user.email : "Loading..."}
              </Text>
              <MaterialIcon
                name={showUserOptions ? "unfold-less" : "unfold-more"}
                size={18}
                color={"#858585"}
                style={{ alignSelf: "center" }}
              />
            </Pressable>
          </View>
          {showUserOptions ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                paddingTop: 10,
              }}
            >
              <Pressable
                onPress={() => {
                  setDarken(true);
                  setShowDeleteUser(true);
                }}
                style={[
                  {
                    height: 40,
                    flex: 1,
                    marginHorizontal: 10,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 0,
                    backgroundColor: Dark.quatrenary,
                    borderRadius: 15,
                  },
                ]}
              >
                <Text style={[styles.optionsText, { color: Dark.alert }]}>
                  Delete account
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  supabase.auth.signOut();
                }}
                style={[
                  {
                    height: 40,
                    flex: 1,
                    marginHorizontal: 10,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 0,
                    backgroundColor: Dark.quatrenary,
                    borderRadius: 15,
                  },
                ]}
              >
                <Text style={[styles.optionsText, { color: Dark.primary }]}>
                  Sign out
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        {/* notebook list */}
        <ScrollView style={{ width: "100%", alignSelf: "center", padding: 25 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.heading}>Your notebooks</Text>
            <Pressable
              onPress={() => {
                setShowNewNotebook(true);
                setDarken(true);
              }}
            >
              <MaterialIcon name={"add"} size={34} color={Dark.secondary} />
            </Pressable>
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color="grey" />
          ) : (
            noteSets
          )}
        </ScrollView>
      </Animated.View>
      {/* Notebook options modal */}
      <NotebookOptions
        id={selectedNotebook?.id}
        requestClose={() => {
          setShowNotebookOptions(false);
          setDarken(false);
        }}
        showModal={showNotebookOptions}
      />
      {/* New notebook modal */}
      <NewNotebookModal
        userId={user ? user.id : null}
        requestClose={() => {
          setShowNewNotebook(false);
          setDarken(false);
        }}
        visible={showNewNotebook}
        onConfirm={() => {
          setShowNewNotebook(false);
          setDarken(false);
        }}
      />
      {/* Delete account modal */}
      <DeleteAccountModal
        requestClose={() => {
          setShowDeleteUser(false);
          setDarken(false);
        }}
        showModal={showDeleteUser}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  studySet: {
    padding: 15,
    margin: 10,
    marginBottom: -5,
    // flex: 0,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    flexGrow: 10,
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 2,
    gap: 11,
  },
  optionsContainer: {
    backgroundColor: "#242424",
    borderRadius: 15,
    flexDirection: "column",
    margin: 25,
    height: 170,
    overflow: "hidden",
  },
  optionButton: {
    borderBottomWidth: 3,
    borderBottomColor: Dark.tertiary,
    padding: 15,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  optionsModal: {
    flex: 2,
    borderRadius: 15,
    backgroundColor: Dark.tertiary,
  },
  header: {
    flexDirection: "column",
    paddingVertical: 14,
    borderBottomWidth: 2,
    width: "100%",
    borderBottomColor: "#212121",
  },
  heading: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 27,
    marginBottom: 20,
    color: Dark.secondary,
  },
  text: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 30,
    color: "#292727",
  },
  optionsText: {
    fontFamily: "PoppinsRegular",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 30,
    color: Dark.primary,
  },
  icon: {
    borderWidth: 1,
    borderColor: "#858585",
    borderRadius: 5,
    alignItems: "center",
    width: 40,
    height: 40,
    marginLeft: 12,
    flexDirection: "column",
    justifyContent: "center",
  },
});

export default MainScreen;
