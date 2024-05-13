import axios from "axios";

const ApiManager = axios.create({
  baseURL: "http://172.23.144.1:8080",
  responseType: "json",
  timeout: 10000,
  withCredentials: true,
});

export default ApiManager;
