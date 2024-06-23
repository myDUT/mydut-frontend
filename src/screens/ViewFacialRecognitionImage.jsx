import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import SplashScreen from "./SplashScreen";
import {
  getAllFacialImagesByLesson,
  getPersonalImages,
} from "../api/storage_api";

const { width } = Dimensions.get("window");

export default function ViewFacialRecognitionImage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { top: paddingTop } = useSafeAreaInsets();

  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUris, setImageUris] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // receivedData is classId
  const isAttendanceData = route.params?.isAttendanceData || null;

  const fetchAllImages = async () => {
    setIsLoading(true);
    try {
      let request_data = {
        classId: route.params?.classId,
        classCode: route.params?.classCode,
        lessonId: route.params?.lessonId,
        isPublicBucket: false,
        isRecursive: true,
      };
      const result = await getAllFacialImagesByLesson(request_data);
      if (result.data.success === true) {
        setImageUris(result?.data?.data || []);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllImages();
  }, []);

  const openImage = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <TouchableOpacity
        onPress={() => navigation.navigate("HomeScreen")}
        style={styles.btnBack}
      >
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color={"#000000"}
          style={{ fontWeight: "600" }}
        />
      </TouchableOpacity>
      <Text style={styles.txtLogin}>
        {!isAttendanceData
          ? "Personal Recognition Data"
          : "Attendance Image Data"}
      </Text>
      <FlatList
        data={imageUris}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openImage(item.url)}
            style={styles.imageContainer}
          >
            <Image source={{ uri: item.url }} style={styles.image} />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollView}
      />
      {selectedImage && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeImage}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={closeImage} style={styles.closeButton}>
              <Ionicons name="close-circle" size={36} color="#fff" />
            </TouchableOpacity>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          </View>
        </Modal>
      )}
      <SplashScreen isDisplay={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 24,
  },
  btnBack: {
    marginLeft: -12,
    marginTop: 12,
    marginBottom: 16,
  },
  txtLogin: {
    fontSize: 28,
    fontWeight: "700",
  },
  scrollView: {
    marginTop: 20,
    paddingBottom: 20,
    // marginHorizontal: -24,
  },
  imageContainer: {
    flex: 1,
    margin: 6, // Tăng khoảng cách giữa các cột
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width / 2 - 35, // Điều chỉnh chiều rộng của hình ảnh và trừ đi khoảng cách giữa các hình ảnh
    height: 180,
    resizeMode: "contain",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  fullImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
});
