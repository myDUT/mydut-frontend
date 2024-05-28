import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiManager from "./ApiManager";

export const getListClassByUser = async () => {
  try {
    // Retrieve the token from AsyncStorage
    const accessToken = await AsyncStorage.getItem("accessToken");

    const result = await ApiManager("/classes", {
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

export const addNewClass = async (data) => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");

    const newClass = {
      roomId: data?.roomId || "",
      name: data?.name || "",
      classCode: data?.classCode || "",
      dayOfWeek: data?.dayOfWeek || "",
      dateFrom: data?.dateFrom || "",
      dateTo: data?.dateTo || "",
      timeFrom: data?.timeFrom || "",
      timeTo: data?.timeTo || "",
    };

    const result = await ApiManager("/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: newClass,
    });

    return result;
  } catch (error) {
    return error.response;
  }
};
