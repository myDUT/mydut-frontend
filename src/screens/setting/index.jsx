import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { getUserById } from "../../api/user_api";
import {
  getPresignedUploadUrls,
  syncPersonalData,
  uploadImage,
} from "../../api/storage_api";
import SplashScreen from "../SplashScreen";

export default function Setting() {
  const { top: paddingTop } = useSafeAreaInsets();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  const [images, setImages] = useState([]);

  const onLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("fullName");
    await AsyncStorage.removeItem("roleName");
    await AsyncStorage.removeItem("principal");

    navigation.replace("Login");
  };

  const fetchPersonalInfoByUserId = async () => {
    setIsLoading(true);
    const principal = await AsyncStorage.getItem("principal");
    const data = JSON.parse(principal);
    const userId = data?.userId;
    try {
      const result = await getUserById(userId);
      if (result.data.success === true) {
        setPersonalInfo(result?.data?.data || []);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalInfoByUserId();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      uploadImagesData();
    }
  }, [images]);

  useEffect(() => {
    if (modalVisible) {
      // Start fade-in and slide-up animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Start fade-out and slide-down animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible, fadeAnim, slideAnim]);

  const uploadImagesData = async () => {
    setIsUploading(true);
    const fileNames = images.map((asset) => asset.fileName);
    const data = { fileNames: fileNames };
    try {
      const result = await getPresignedUploadUrls(data);
      if (result.data.success === true) {
        const preSignedUrls = result?.data?.data || [];

        // preSignedUrls.map(async (preSignedUrl, index) => {
        //   const localImage = images[index];

        //   await uploadImage(preSignedUrl.url, localImage);
        // });
        // Tạo một mảng các promises từ các calls uploadImage
        const uploadPromises = preSignedUrls.map((preSignedUrl, index) => {
          const localImage = images[index];
          return uploadImage(preSignedUrl.url, localImage);
        });

        // Chờ tất cả các promises hoàn thành
        await Promise.all(uploadPromises);

        console.log(
          "🚀 ~ uploadImagesData ~ personalInfo?.studentCode:",
          personalInfo?.studentCode
        );
        // Call Django Server to synchonize personal data
        syncPersonalData(personalInfo?.studentCode);
      }
    } catch (error) {
    } finally {
      setIsUploading(false);
      setImages([]);
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.canceled) {
      setImages(result?.assets);
    }
  };

  const openImageLibrary = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access photo library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result?.assets);
      // console.log(result?.assets[0]?.uri);
      // console.log(result?.assets.map((asset) => asset.fileName));
    }
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profilePic}>
            <Image
              style={styles.profilePicImage}
              source={{
                uri: "https://dut.udn.vn/Files/admin/images/Tin_tuc/Khac/2020/LogoDUT/image002.jpg",
                // uri: "http://172.23.144.133:9000/mydut-private-dev/user-data/102190002/1000000048.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=r9Fsr6GkIDj9tgb6oExn%2F20240615%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240615T172353Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=048521d1f3805344a6af9d8cc0cc3aaf6d848a15bec9772ca6cd82d355f59e76",
              }}
            />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>{personalInfo["fullName"]}</Text>
            <View style={styles.headerSubContent}>
              {personalInfo["roleName"] === "STUDENT" && (
                <>
                  <Text style={styles.headerSubText}>
                    Student ID: {personalInfo["studentCode"]}
                  </Text>
                  <Text style={styles.headerSubText}>
                    Homeroom class: {personalInfo["homeroomClass"]}
                  </Text>
                </>
              )}
              {personalInfo["roleName"] !== "STUDENT" && (
                <>
                  <Text style={styles.headerSubText}>
                    Email: {personalInfo["email"]}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {personalInfo["roleName"] === "STUDENT" && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons
              name="eye-outline"
              size={20}
              color="#f38933"
              style={styles.menuIcon}
            />
            <Text style={styles.menuItemText}>Facial Recognition Data</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color="#000"
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="settings-outline"
            size={20}
            color="#f38933"
            style={styles.menuIcon}
          />
          <Text style={styles.menuItemText}>Settings</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color="#000"
            style={styles.rightIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="help-circle-outline"
            size={20}
            color="#f38933"
            style={styles.menuIcon}
          />
          <Text style={styles.menuItemText}>Support</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color="#000"
            style={styles.rightIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onLogout()}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#f38933"
            style={styles.menuIcon}
          />
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.companyInfoContainer}>
        <Text style={styles.companyInfoText}>CAPSTONE PROJECT K19 - myDUT</Text>
        <Text style={styles.companyInfoText}>
          Da Nang University of Science and Technology
        </Text>
        <Text style={styles.companyInfoText}>
          Address: 54 Nguyen Luong Bang, Hoa Khanh Bac Ward, Lien Chieu
          District, Da Nang
        </Text>
        <Text style={styles.companyInfoText}>Phone: 096 450 9757</Text>
        <Text style={styles.companyInfoText}>Email: ngocdat1908@gmail.com</Text>
      </View>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalButton}
              onPress={openCamera}
            >
              <Text style={styles.modalButtonText}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalButton}
              onPress={openImageLibrary}
            >
              <Text style={styles.modalButtonText}>
                Import Images From Library
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalButton}
              onPress={() => {
                navigation.navigate("ViewPersonalImage", { isAttendanceData: false });
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>View Images Data</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
      {/* <Image
        source={{
          uri: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540vndat00%252FCheckInApp/ImagePicker/9a92fbc2-3bcb-4a9d-b3ee-ea937961a748.png",
        }}
      /> */}
      <SplashScreen isDisplay={isUploading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#f38933",
    paddingHorizontal: 20,
    paddingVertical: 25,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerContent: {
    marginLeft: 15,
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    gap: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  headerSubContent: {
    flexDirection: "column",
  },
  headerSubText: {
    fontSize: 14,
    color: "white",
  },
  editIcon: {
    alignSelf: "flex-end",
  },
  phoneNumber: {
    fontSize: 16,
    color: "white",
    marginVertical: 5,
  },
  profilePic: {
    width: 70,
    height: 70,
    // borderRadius: 40,
    overflow: "hidden",
  },
  profilePicImage: {
    width: "100%",
    height: "100%",
  },
  menuContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuIcon: {
    marginRight: 10,
  },
  menuItemText: {
    fontSize: 16,
    flex: 1,
  },
  rightIcon: {
    marginLeft: "auto",
  },
  companyInfoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "flex-end",
    flex: 1,
  },
  companyInfoText: {
    fontSize: 12,
    color: "#888",
    textAlign: "left",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: "center",
  },
  modalButton: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f38933",
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
