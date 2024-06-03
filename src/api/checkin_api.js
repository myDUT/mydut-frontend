import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiManager from "./ApiManager";

export const openCheckIn = async (data) => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");

    const result = await ApiManager("/lessons/start-check-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
    });
    return result;
  } catch (error) {
    return error.response;
  }
};

export const closeCheckIn = async (lessonId) => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");

    const result = await ApiManager(
      `/lessons/end-check-in?lessonId=${lessonId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return result;
  } catch (error) {
    return error.response;
  }
};

export const checkIn = async (data) => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");

    const result = await ApiManager("/attendance-records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
    });
    return result;
  } catch (error) {
    return error.response;
  }
};

export const getAttendanceReport = async (data) => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");

    const report_request = {
      lessonId: data?.lessonId || "",
      classId: data?.classId || "",
    };

    const result = await ApiManager("/attendance-records/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: report_request,
    });
    return result;
  } catch (error) {
    return error.response;
  }
};
