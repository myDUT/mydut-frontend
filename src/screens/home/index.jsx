import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal as ModalDefault,
  Animated,
} from "react-native";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "./components/Header";
import LessonCard from "./components/LessonCard";
import TimeCard from "./components/TimeCard";
import CurrentDate from "./components/CurrentDate";
import { formatTimestampToHHmm } from "../../utils/DateUtils";
import * as Location from "expo-location";
import { ROLE } from "../../enum/RoleEnum";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLessonInADay } from "../../api/lesson_api";
import EmptyListComponent from "./components/EmptyListComponent";
import { checkIn, closeCheckIn, openCheckIn } from "../../api/checkin_api";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import {
  facialRecognition,
  getPresignedUrlsToRecognition,
  uploadImage,
} from "../../api/storage_api";
import SplashScreen from "../SplashScreen";

export default function Home() {
  const { top: paddingTop } = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [modalCheckInVisible, setModalCheckInVisible] = useState(false);
  const [modalImagePicker, setModalImagePicker] = useState(false);
  const [location, setLocation] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [lessonList, setLessonList] = useState([]);
  const [currentLessonCheckIn, setCurrectLessonCheckIn] = useState({
    lessonId: "",
    classCode: "",
    classId: "",
    isEnableCheckIn: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingRecogImages, setIsUploadingRecogImages] = useState(false);
  const [recogImages, setRecogImages] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    getLocation();
    getRoleName();
  }, []);

  useEffect(() => {
    fetchAvailableLessonList(selectedDate);
    // console.log("🚀 ~ useEffect ~ lessonList:", lessonList)
  }, [selectedDate, modalCheckInVisible]);

  // useEffect(() => {
  //   console.log("🚀 ~ useEffect ~ lessonList:", lessonList);
  // }, [lessonList]);
  useEffect(() => {
    if (modalImagePicker) {
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
  }, [modalImagePicker, fadeAnim, slideAnim]);

  useEffect(() => {
    console.log("Tracking current lesson check in:", currentLessonCheckIn);
  }, [currentLessonCheckIn]);

  useEffect(() => {
    if (recogImages.length > 0) {
      uploadRecogImages();
    }
  }, [recogImages]);

  const fetchAvailableLessonList = async (time) => {
    setIsLoading(true);
    try {
      const result = await getLessonInADay(
        moment(time, "YYYY-MM-DD").valueOf()
      );
      if (result.data.success === true) {
        setLessonList(result?.data?.data || []);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysOfWeek = () => {
    const today = new Date();
    const currentDay = today.getDay(); // Lấy ngày trong tuần của ngày hiện tại (0 là Chủ Nhật, 1 là Thứ Hai, ..., 6 là Thứ Bảy)
    const daysOfWeek = [];

    // Đặt ngày hiện tại trở lại ngày đầu tuần (Chủ Nhật)
    today.setDate(today.getDate() - currentDay);

    // Tạo mảng các ngày từ ngày đầu tuần tới cuối tuần (7 ngày)
    for (let i = 0; i < 7; i++) {
      const dateString = today.toISOString().slice(0, 10); // Lấy ngày dưới dạng chuỗi YYYY-MM-DD
      daysOfWeek.push(dateString);
      today.setDate(today.getDate() + 1); // Tăng ngày lên 1 để lấy ngày tiếp theo
    }

    return daysOfWeek;
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      const location = await Location.getCurrentPositionAsync({});

      setLocation(location);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const getRoleName = async () => {
    try {
      const role = await AsyncStorage.getItem("roleName");
      setRoleName(role);
    } catch (error) {}
  };

  const handleDayPress = (day) => {
    setSelectedDate(day);
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    if (location && location.coords) {
      const { latitude, longitude } = location.coords;
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      const coordinate = {
        latitude: latitude,
        longitude: longitude,
      };
      const data = {
        lessonId: currentLessonCheckIn.lessonId,
        coordinate: coordinate,
      };
      try {
        const result = await checkIn(data);
        if (result.data.success === true) {
          showSuccessCheckInToast();
        } else {
          showFailedCheckIn();
        }
      } catch (error) {
        showErrorCheckInToast();
      } finally {
        setModalCheckInVisible(false);
      }
    } else {
      console.log("Location information is not available.");
      Alert.alert(
        "Please enable location service in Settings to be able to check in."
      );
    }
    setIsLoading(false);
    setModalCheckInVisible(false);
  };

  const handleManageCheckIn = async (isEnableCheckIn) => {
    setIsLoading(true);
    if (isEnableCheckIn === false) {
      // open check in form
      if (location && location.coords) {
        const { latitude, longitude } = location.coords;
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        const coordinate = {
          latitude: latitude,
          longitude: longitude,
        };
        const data = {
          lessonId: currentLessonCheckIn.lessonId,
          coordinate: coordinate,
        };
        try {
          const result = await openCheckIn(data);
          if (result.data.success === true) {
            showSuccessOpenCheckInToast();
          } else {
            showErrorCheckInToast();
          }
        } catch (error) {
          showErrorCheckInToast();
        } finally {
          setModalCheckInVisible(false);
        }
      } else {
        console.log("Location information is not available.");
        Alert.alert(
          "Please enable location service in Settings to be able to check in."
        );
      }
      setIsLoading(false);
      setModalCheckInVisible(false);
    } else {
      // lock check in form
      try {
        const result = await closeCheckIn(currentLessonCheckIn.lessonId);
        if (result.data.success === true) {
          showSuccessLockCheckInToast();
        } else {
          showErrorCheckInToast();
        }
      } catch (error) {
        showErrorCheckInToast();
      } finally {
        setIsLoading(false);
        setModalCheckInVisible(false);
      }
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
      setRecogImages(result?.assets);
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
      setRecogImages(result?.assets);
      // console.log(result?.assets[0]?.uri);
      // console.log(result?.assets.map((asset) => asset.fileName));
    }
  };

  const uploadRecogImages = async () => {
    setIsUploadingRecogImages(true);
    const fileNames = recogImages.map((asset) => asset.fileName);
    const data = {
      fileNames: fileNames,
      classId: currentLessonCheckIn.classId,
      classCode: currentLessonCheckIn.classCode,
      lessonId: currentLessonCheckIn.lessonId,
    };

    const recognition_request = {
      classId: currentLessonCheckIn.classId,
      classCode: currentLessonCheckIn.classCode,
      lessonId: currentLessonCheckIn.lessonId,
    };

    try {
      const result = await getPresignedUrlsToRecognition(data);
      if (result?.data?.success == true) {
        const preSignedUrls = result?.data?.data || [];

        const uploadPromises = preSignedUrls.map((preSignedUrl, index) => {
          const localImage = recogImages[index];
          return uploadImage(preSignedUrl.url, localImage);
        });

        // Wait to all promise completely
        await Promise.all(uploadPromises);

        // Call Django Service to facial recognition
        facialRecognition(recognition_request);
      }
    } catch (error) {
    } finally {
      setIsUploadingRecogImages(false);
      setRecogImages([]);
    }
  };

  const showErrorCheckInToast = () => {
    Toast.show({
      type: "error",
      text1: "Notification",
      text2: "An error has occurred. Please try again later.",
    });
  };

  const showFailedCheckIn = () => {
    Toast.show({
      type: "error",
      text1: "Notification",
      text2: "Check-in failed due to the form being locked.",
    });
  };

  const showSuccessCheckInToast = () => {
    Toast.show({
      type: "success",
      text1: "Notification",
      text2: "Check-in successfully.",
    });
  };

  const showSuccessOpenCheckInToast = () => {
    Toast.show({
      type: "success",
      text1: "Notification",
      text2: "Opened check-in form.",
    });
  };
  const showSuccessLockCheckInToast = () => {
    Toast.show({
      type: "success",
      text1: "Notification",
      text2: "Locked check-in form.",
    });
  };

  const openImagePicker = () => {
    setModalCheckInVisible(!modalCheckInVisible);
    setModalImagePicker(!modalImagePicker);
  };

  const DayItem = (date) => {
    const formattedDate = moment(date.day).format("DD");
    const dayOfWeek = moment(date.day).format("ddd");

    return (
      <TouchableOpacity
        style={[
          styles.item,
          date.day === selectedDate ? { backgroundColor: "#FF7648" } : null,
        ]}
        onPress={() => handleDayPress(date.day)}
      >
        <Text
          style={[
            styles.txtDayOfWeek,
            date.day === selectedDate ? { color: "white" } : null,
          ]}
        >
          {dayOfWeek}
        </Text>
        <Text
          style={[
            styles.txtDate,
            date.day === selectedDate ? { color: "white" } : null,
          ]}
        >
          {formattedDate}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <Header />
      <CurrentDate />
      <View style={styles.viewFilter}>
        {/* <Text style={styles.txtFilterTask}>Today's Task</Text>
        <Text style={styles.txtFilterDesc}>
          See courses you need to join today
        </Text> */}
        <FlatList
          style={{ marginHorizontal: -12 }}
          scrollEnabled={false}
          horizontal
          data={getDaysOfWeek()}
          renderItem={({ item }) => <DayItem day={item} />}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.viewContent}>
        {/* <View style={styles.viewCurrentDate}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Today</Text>
          <Text style={styles.txtCurrentDate}>{getCurrentDate()}</Text>
        </View> */}
        <View style={styles.columnHeader}>
          <Text style={styles.timeColumn}>Time</Text>
          <Text style={styles.classColumn}>Class</Text>
        </View>
        <FlatList
          scrollEnabled={true}
          vertical
          // onRefresh={() => fetchAvailableLessonList(selectedDate)}
          // refreshing={isLoading}
          data={lessonList}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 1 }}>
                <TimeCard timeClass={item} />
              </View>
              <View style={{ flex: 3 }}>
                <LessonCard
                  onPress={(lessonId, classCode, classId, isEnableCheckIn) => {
                    setModalCheckInVisible(true);
                    setModalImagePicker(true);
                    setCurrectLessonCheckIn({
                      lessonId: lessonId,
                      classCode: classCode,
                      classId: classId,
                      isEnableCheckIn: isEnableCheckIn,
                    });
                  }}
                  infoClass={item}
                  roleName={roleName}
                />
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<EmptyListComponent />}
        />
      </View>
      {roleName === ROLE.STUDENT && (
        <Modal
          isVisible={modalCheckInVisible}
          onBackdropPress={() => setModalCheckInVisible(false)}
          style={styles.modalCheckIn}
          // customBackdrop={<View style={{ flex: 1, height: 200 }} />}
        >
          <View style={[styles.viewModalCheckIn, { flex: 0.2 }]}>
            <Text style={styles.txtModalCheckIn}>
              Are you sure to check in at {formatTimestampToHHmm(moment())}?
            </Text>
            <TouchableOpacity
              onPress={() => handleCheckIn()}
              style={styles.btnCheckIn}
            >
              <Text style={{ fontSize: 18, fontWeight: "600", color: "white" }}>
                CHECK-IN
              </Text>
              {/* <ActivityIndicator size={"large"} color={"red"} /> */}
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      {roleName === ROLE.TEACHER && (
        <>
          <ModalDefault
            animationType="none"
            transparent={true}
            visible={modalImagePicker}
            onRequestClose={() => setModalImagePicker(false)}
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
                  style={styles.modalButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    handleManageCheckIn(currentLessonCheckIn.isEnableCheckIn);
                    setModalImagePicker(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>
                    {currentLessonCheckIn.isEnableCheckIn ? "Lock" : "Open"}{" "}
                    Check-in Form
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  activeOpacity={0.8}
                  onPress={openImageLibrary}
                >
                  <Text style={styles.modalButtonText}>
                    Import Images To Recognize
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonText}>
                    Facial Recognition Attendance Data
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonText}>Attendance Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.modalButton}
                  onPress={() => setModalImagePicker(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </ModalDefault>
        </>
      )}
      <SplashScreen isDisplay={isUploadingRecogImages} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  viewFilter: {
    marginTop: 15,
    gap: 12,
  },
  txtFilterTask: {
    fontSize: 30,
    fontWeight: "bold",
  },
  item: {
    paddingVertical: 12,
    width: 48,
    marginRight: 8,
    borderWidth: 0,
    borderColor: "#ccc",
    borderRadius: 12,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  txtDayOfWeek: {
    fontSize: 16,
    fontWeight: "bold",
  },
  txtDate: {},
  viewContent: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomWidth: 0,
    marginHorizontal: -12,
    flex: 1,
  },
  viewCurrentDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginVertical: 12,
    alignItems: "center",
  },
  txtCurrentDate: {
    marginRight: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  columnHeader: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  timeColumn: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#848586",
    fontWeight: "700",
  },
  classColumn: {
    flex: 3,
    textAlign: "left",
    fontSize: 16,
    paddingLeft: 10,
    color: "#848586",
    fontWeight: "700",
  },
  modalCheckIn: {
    flex: 1,
  },
  viewModalCheckIn: {
    // flex: 0.2,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
  },
  btnCheckIn: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 8,
    backgroundColor: "#f38933dd",
    // marginBottom: 30,
    // padding: 30,
  },
  txtModalCheckIn: {
    fontSize: 18,
    marginTop: 16,
    fontWeight: "500",
  },
  txtOrText: {
    marginTop: -25,
    marginBottom: -25,
    fontSize: 16,
    fontWeight: "400",
    color: "#555555",
  },

  // Modal image picker style
  modalImagePicker: {
    justifyContent: "flex-end",
    margin: 0,
  },
  viewModalImagePicker: {
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
