import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiManager from "./ApiManager";

export const userLogin = async (data) => {
  // console.log("🚀 ~ constuser_login= ~ data:", data);
  try {
    const result = await ApiManager("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    });
    return result;
  } catch (error) {
    // console.log("🚀 ~ constuser_login= ~ error:", error)
    return error.response.data;
  }
};

export const addNewUser = async (data) => {
  try {
    const result = await ApiManager("/users/add-new-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    });
    return result;
  } catch (error) {
    return error.response;
  }
};

export const getUserById = async (userId) => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");

    const result = await ApiManager(`/users/${userId}`, {
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
