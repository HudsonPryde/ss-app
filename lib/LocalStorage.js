import AsyncStorage from "@react-native-async-storage/async-storage";

// Store user preferences in AsyncStorage
// Params@
// key: id of collection being stored
// data: collection to store
export const storeData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
};

// Retrieve user preferences from AsyncStorage
// @params key: the id of the documents being retrieved
export const getData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data != null ? JSON.parse(data) : null;
  } catch (error) {
    console.error(error);
  }
};
