import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiManager from "./ApiManager";

export const enrollInClass = async (data) => {
  try {
    // Retrieve the token from AsyncStorage
    const accessToken = await AsyncStorage.getItem("accessToken");

    const result = await ApiManager("/enrollments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: { classCode: data.classCode },
    });
    return result;
  } catch (error) {
    return error.response;
  }
};
