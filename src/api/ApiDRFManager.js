import axios from "axios";
import { replace } from "../navigator";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ApiDRFManager = axios.create({
  baseURL: "http://172.23.144.1:8000",
  responseType: "json",
  timeout: 6000,
});

// result.data = error.response
export default ApiDRFManager;
