import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiManager from "./ApiManager";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import axios from "axios";
import ApiDRFManager from "./ApiDRFManager";

export const getPresignedUploadUrls = async (data) => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  try {
    const result = await ApiManager("/storages/upload-files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
    });

    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const getPresignedUrlsToRecognition = async (data) => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  try {
    const result = await ApiManager("/storages/upload-recognition-images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
    });

    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const getPersonalImages = async () => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  try {
    const request_data = {
      path: "",
      searchText: "",
      isPublicBucket: false,
      isRecursive: true,
    };
    const result = await ApiManager("/storages/data-image-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: request_data,
    });

    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const getAllFacialImagesByLesson = async (data) => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  try {
    const result = await ApiManager("/storages/facial-image-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
    });

    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const uploadImage = async (presignedUrl, localImageAsset) => {
  try {
    const fileUri = localImageAsset.uri;

    const binaryData = await fileToBinary(localImageAsset.uri);

    // const fileData = await FileSystem.readAsStringAsync(fileUri, {
    //   encoding: FileSystem.EncodingType.Base64, // Đọc dưới dạng base64 (tạm thời)
    // });

    // // Chuyển đổi Base64 sang binary
    // const binaryData = Buffer.from(fileData, "base64");

    // console.log("2");

    const result = await ApiManager(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": localImageAsset.mimeFile,
      },
      data: binaryData,
    });
    // Upload the binary data using Axios

    return result;
  } catch (error) {
    console.log("Error uploading image:", error);
    return error.response.data;
  }
};

export const fileToBinary = async (fileUri) => {
  try {
    const response = await fetch(fileUri);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const binaryData = await response.arrayBuffer();
    return binaryData;
  } catch (error) {
    throw new Error("Unable to fetch the file as binary data");
  }
};

export const syncPersonalData = async (studentCode) => {
  try {
    const result = await ApiDRFManager("/face-recognition/sync-personal-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: { student_code: studentCode },
    });

    return result;
  } catch (error) {
    return error.response.error;
  }
};

export const facialRecognition = async (request) => {
  const data = {
    class_id: request.classId,
    class_code: request.classCode,
    lesson_id: request.lessonId,
  };

  try {
    const result = await ApiDRFManager("/face-recognition/recognize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    });

    return result;
  } catch (error) {
    return error.response.error;
  }
};
