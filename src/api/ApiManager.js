import axios from "axios";
import { replace } from "../navigator";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ApiManager = axios.create({
  // baseURL: "http://172.23.144.1:8080",
  baseURL: "http://35.240.129.253:8080",
  // baseURL: "https://mayfly-electric-frankly.ngrok-free.app",
  responseType: "json",
  timeout: 6000,
  withCredentials: true,
});

// result.data = error.response

ApiManager.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.data?.errorCode === "TOKEN_EXPIRED") {
      // Token has expired or is invalid
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("userName");
      await AsyncStorage.removeItem("fullName");
      await AsyncStorage.removeItem("roleName");
      await AsyncStorage.removeItem("principal");

      // Alert the user
      Alert.alert("Session expired", "Please log in again.");

      // Navigate to the login screen
      replace("Login");
    }
    return Promise.reject(error);
  }
);

export default ApiManager;
