import moment from "moment";
import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "./components/Header";
import LessonCard from "./components/LessonCard";
import TimeCard from "./components/TimeCard";
import CurrentDate from "./components/CurrentDate";
import { getLessonList } from "../../mock/data_mock";
import { formatTimestampToHHmm } from "../../utils/DateUtils";
import * as Location from "expo-location";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [modalCheckInVisible, setModalCheckInVisible] = useState(false);

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

  const handleDayPress = (day) => {
    setSelectedDate(day);
  };

  const renderModalCheckIn = () => {
    const handleCheckIn = async () => {
      try {
        // Kiểm tra quyền truy cập vị trí của người dùng
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          // Xử lý trường hợp người dùng không cấp quyền truy cập
          return;
        }

        // Lấy vị trí của thiết bị
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        setModalCheckInVisible(false);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={modalCheckInVisible}
        // onRequestClose={() => {
        //   setModalCheckInVisible(!modalCheckInVisible);
        // }}
      >
        <TouchableWithoutFeedback
          onPress={() => setModalCheckInVisible(!modalCheckInVisible)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Are you sure to check-in at {formatTimestampToHHmm(moment())}?
                </Text>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => handleCheckIn()}
                >
                  <Text style={styles.textStyle}>Check-in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const { top: paddingTop } = useSafeAreaInsets();

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
          data={getLessonList()}
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
                  onPress={() => {
                    setModalCheckInVisible(true);
                  }}
                  infoClass={item}
                />
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {renderModalCheckIn()}
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

  // CSS modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    marginTop: 18,
    marginBottom: -12,
    width: 120,
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
