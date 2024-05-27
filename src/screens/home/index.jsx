import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "./components/Header";
import LessonCard from "./components/LessonCard";
import TimeCard from "./components/TimeCard";
import CurrentDate from "./components/CurrentDate";
import { getLessonList } from "../../mock/data_mock";
import { formatTimestampToHHmm } from "../../utils/DateUtils";
import * as Location from "expo-location";
import { ROLE } from "../../enum/RoleEnum";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLessonInADay } from "../../api/lesson_api";
import EmptyListComponent from "./components/EmptyListComponent";
import { checkIn, closeCheckIn, openCheckIn } from "../../api/checkin_api";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";

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
    isEnableCheckIn: false,
  });
  const [isLoading, setIsLoading] = useState(false);

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
    console.log("Tracking current lesson check in:", currentLessonCheckIn);
  }, [currentLessonCheckIn]);

  const fetchAvailableLessonList = async (time) => {
    try {
      const result = await getLessonInADay(
        moment(time, "YYYY-MM-DD").valueOf()
      );
      if (result.data.success === true) {
        setLessonList(result?.data?.data || []);
      }
    } catch (error) {}
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
                  onPress={(lessonId, isEnableCheckIn) => {
                    setModalCheckInVisible(true);
                    setCurrectLessonCheckIn({
                      lessonId: lessonId,
                      isEnableCheckIn: isEnableCheckIn,
                    });
                  }}
                  infoClass={item}
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
          <Modal
            isVisible={modalCheckInVisible}
            onBackdropPress={() => setModalCheckInVisible(!modalCheckInVisible)}
            style={styles.modalCheckIn}
            // customBackdrop={<View style={{ flex: 1, height: 200 }} />}
          >
            <View style={[styles.viewModalCheckIn, { flex: 0.3 }]}>
              <Text style={styles.txtModalCheckIn}>
                Are you sure to{" "}
                {currentLessonCheckIn.isEnableCheckIn ? "lock" : "open"}{" "}
                check-in form?
              </Text>
              <TouchableOpacity
                onPress={() =>
                  handleManageCheckIn(currentLessonCheckIn.isEnableCheckIn)
                }
                style={styles.btnCheckIn}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "600", color: "white" }}
                >
                  {currentLessonCheckIn.isEnableCheckIn ? "LOCK" : "OPEN"}
                </Text>
                {/* <ActivityIndicator size={"large"} color={"red"} /> */}
              </TouchableOpacity>
              <Text style={[styles.txtOrText]}>- OR -</Text>
              <TouchableOpacity
                onPress={() => openImagePicker()}
                style={styles.btnCheckIn}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "500", color: "white" }}
                >
                  Enhanced Attendance Tracking
                </Text>
                {/* <ActivityIndicator size={"large"} color={"red"} /> */}
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            isVisible={modalImagePicker}
            onBackdropPress={() => setModalImagePicker(!modalImagePicker)}
            style={styles.modalImagePicker}
            // customBackdrop={<View style={{ flex: 1, height: 200 }} />}
          >
            <View style={styles.viewModalImagePicker}>
              <Text>Hello</Text>
              <TouchableOpacity
                onPress={() => setModalImagePicker(!modalImagePicker)}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
      )}
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
});
