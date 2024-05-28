import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiManager from "./ApiManager";

export const fetchRoom = async () => {
  try {
    // Retrieve the token from AsyncStorage
    const accessToken = await AsyncStorage.getItem("accessToken");

    const result = await ApiManager("/rooms", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result;
  } catch (error) {
    return error.response;
  }
};
