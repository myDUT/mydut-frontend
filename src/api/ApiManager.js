import axios from "axios";

const ApiManager = axios.create({
  baseURL: "http://172.23.144.1:8080",
  // baseURL: "https://6e26-1-53-56-103.ngrok-free.app",
  responseType: "json",
  timeout: 6000,
  withCredentials: true,
});

export default ApiManager;
