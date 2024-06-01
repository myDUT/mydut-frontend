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

export const getAllEnrolledStudentInClass = async (classId) => {
  try {
    // Retrieve the token from AsyncStorage
    const accessToken = await AsyncStorage.getItem("accessToken");

    const result = await ApiManager(
      `/enrollments/enrolled-student?classId=${classId}`,
      {
        method: "GET",
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

export const actionWithEnrollment = async (data) => {
  try {
    // Retrieve the token from AsyncStorage
    const accessToken = await AsyncStorage.getItem("accessToken");

    const action_request = {
      classId: data?.classId || "",
      // actionType=1: approve
      // actionType=0: reject
      actionType: data?.actionType !== undefined ? data.actionType : -1,
      userIds: data?.userIds || [],
    };

    const result = await ApiManager(`/enrollments/action-enrollment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: action_request,
    });
    return result;
  } catch (error) {
    return error.response;
  }
};

export const getNumberWaitingEnrollment = async (classId) => {
  try {
    // Retrieve the token from AsyncStorage
    const accessToken = await AsyncStorage.getItem("accessToken");

    const result = await ApiManager(
      `/enrollments/waiting-enrollment?classId=${classId}`,
      {
        method: "GET",
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
