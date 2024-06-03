import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getAttendanceReport } from "../../../api/checkin_api";
import { FlatList } from "react-native-gesture-handler";
import ReportItem from "./ReportItem";
import ItemSeparator from "./ItemSeparator";
import ReportDetailItem from "./ReportDetailItem";

export default function AttendanceReportModal({
  visible,
  onClose,
  classId,
  lessonId,
  advanceMode,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const slideAnim = useRef(new Animated.Value(100)).current; // Initial value for translateY: 100 (hidden below)

  const [reportList, setReportList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchLessonReport();
    }
  }, [visible]);

  const fetchLessonReport = async () => {
    try {
      const report_request = {
        lessonId: lessonId,
        classId: classId,
      };

      const result = await getAttendanceReport(report_request);
      if (result.data.success === true) {
        setReportList(result?.data?.data || []);
      } else {
        console.log(
          "Error when fetch data for view report lessons in class",
          result.data
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (visible) {
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
  }, [visible, fadeAnim, slideAnim]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-outline" size={30} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Attendance Report</Text>
          <View style={styles.viewContent}>
            <FlatList
              scrollEnabled={true}
              vertical
              // onRefresh={() => {
              //   setIsLoading(!isLoading);
              // }}
              // refreshing={isLoading}
              data={reportList}
              renderItem={({ item }) =>
                advanceMode ? (
                  <ReportDetailItem data={item} />
                ) : (
                  <ReportItem data={item} />
                )
              }
              keyExtractor={(item) => item.userId}
              ItemSeparatorComponent={ItemSeparator}
              // ListEmptyComponent={<EmptyListComponent />}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    paddingTop: 30,
    width: "100%",
    maxHeight: "70%", // Chiều cao modal là 70% của chiều cao màn hình
    justifyContent: "center",
    // alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 18,
    margin: -6,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    // marginTop: 10,
    marginBottom: 10,
  },
  studentItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    alignItems: "center",
  },
  viewContent: {
    // flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 12,
    marginHorizontal: -12,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomWidth: 0,
  },
});
