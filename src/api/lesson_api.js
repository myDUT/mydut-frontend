import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiManager from "./ApiManager";

export const getLessonInADay = async (time) => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");

    const result = await ApiManager(`/lessons/get-lessons-in-date/${time}`, {
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
