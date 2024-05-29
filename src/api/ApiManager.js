import axios from "axios";

const ApiManager = axios.create({
  baseURL: "http://172.23.144.1:8080",
  // baseURL: "https://mayfly-electric-frankly.ngrok-free.app",
  responseType: "json",
  timeout: 6000,
  withCredentials: true,
});

// result.data = error.response

export default ApiManager;
