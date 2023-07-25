import React, { useContext, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Modal } from "react-native";
import { Snackbar } from "react-native-paper";
import { Dark } from "../../lib/Theme";
import { supabase } from "../../lib/initSupabase";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../provider/AuthProvider";
import { deleteUser } from "../../dao/user";

const DeleteAccountModal = ({ showModal, requestClose }) => {
  const { user } = useContext(AuthContext);
  const [apiError, setApiError] = useState(false);

  return (
    <Modal animationType="fade" visible={showModal} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <View style={styles.textContainer}>
            <Text style={[styles.modalText, { marginBottom: 0 }]}>
              Are you sure you want to delete your account?
            </Text>
            <Text style={[styles.modalText, { color: Dark.alert }]}>
              All data will be lost forever.
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                { borderRightWidth: 1, borderColor: Dark.quatrenary },
              ]}
              onPress={async () => {
                try {
                  await deleteUser(user.id);
                  await supabase.auth.signOut();
                } catch (error) {
                  setApiError(true);
                  console.log(error);
                }
              }}
            >
              <Text style={styles.confirmText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { borderLeftWidth: 1, borderColor: Dark.quatrenary },
              ]}
              onPress={requestClose}
            >
              <Text style={styles.cancelText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
            textAlign: "center",
            fontFamily: "inter",
            fontSize: 18,
          }}
        >
          Uh oh! Something went wrong. Please try again later.
        </Text>
      </Snackbar>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: Dark.tertiary,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  modalText: {
    color: Dark.primary,
    fontFamily: "Inter",
    fontSize: 18,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderTopWidth: 2,
    borderColor: Dark.quatrenary,
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  confirmText: {
    color: Dark.alert,
    fontFamily: "Inter",
    fontSize: 18,
  },
  cancelText: {
    color: Dark.primary,
    fontFamily: "Inter",
    fontSize: 18,
  },
});

export default DeleteAccountModal;
