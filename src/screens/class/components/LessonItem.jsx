import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import AttendanceReportModal from "./AttendanceReportModal";
import moment from "moment";

export default function LessonItem({
  data,
  openSwipeableRef,
  closeOpenSwipeable,
  roleName,
}) {
  const swipeableRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [advanceMode, setAdvanceMode] = useState(false);

  const renderRightActions = (progress, dragX) => {
    const scaleApprove = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 1, 0.8],
      extrapolate: "clamp",
    });

    const opacityApprove = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 1, 0],
      extrapolate: "clamp",
    });

    const scaleDelete = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 1, 0.8],
      extrapolate: "clamp",
    });

    const opacityDelete = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={{ flexDirection: "row" }}>
        <Animated.View
          style={[
            styles.viewApprove,
            {
              transform: [{ scale: scaleApprove }],
              opacity: opacityApprove,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.btnAction}
            onPress={() => {
              swipeableRef.current.close();
            }}
          >
            <Ionicons name="create-outline" size={24} color={"white"} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            styles.viewDelete,
            { transform: [{ scale: scaleDelete }], opacity: opacityDelete },
          ]}
        >
          <TouchableOpacity
            style={styles.btnAction}
            onPress={() => {
              swipeableRef.current.close();
            }}
          >
            <Ionicons name="close-outline" size={24} color={"white"} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const handleSwipeableWillOpen = () => {
    if (
      swipeableRef.current &&
      swipeableRef.current !== openSwipeableRef.current
    ) {
      closeOpenSwipeable();
      openSwipeableRef.current = swipeableRef.current;
    }
  };

  const {
    lessonId,
    classId,
    datetimeFrom,
    datetimeTo,
    roomName,
    totalStudent,
    presentStudent,
  } = data;

  const handleModeForReport = () => {
    Alert.alert(
      "Confirm",
      "Choose the display mode for the lesson's report?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Advance",
          onPress: () => {
            setAdvanceMode(true);
            setModalVisible(true);
          },
          style: "default",
        },
        {
          text: "Normal",
          onPress: () => {
            setAdvanceMode(false);
            setModalVisible(true);
          },
          style: "default",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      onSwipeableWillOpen={handleSwipeableWillOpen}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        // onPress={() => setModalVisible(true)}
        onPress={handleModeForReport}
      >
        <View style={styles.container}>
          <View style={styles.viewRoomTime}>
            <View style={styles.viewItem}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={"#f38933dd"}
                style={styles.icon}
              />
              <Text style={styles.text}>
                {moment(datetimeFrom).format("dddd, MMMM D, YYYY")}
              </Text>
            </View>
            <View style={styles.viewItem}>
              <Ionicons
                name="time-outline"
                size={20}
                color={"#f38933dd"}
                style={styles.icon}
              />
              <Text style={styles.text}>
                {moment(datetimeFrom).format("HH:mm")} - {moment(datetimeTo).format("HH:mm")}
              </Text>
            </View>
            <View style={styles.viewItem}>
              <Ionicons
                name="location-outline"
                size={20}
                color={"#f38933dd"}
                style={styles.icon}
              />
              <Text style={styles.text}>{roomName}</Text>
            </View>
          </View>
          <View style={styles.viewReport}>
            <Ionicons
              name="people-outline"
              size={20}
              color={"#f38933dd"}
              style={styles.icon}
            />
            <Text style={styles.text}>
              {presentStudent || 0}/{totalStudent || 0}
            </Text>
          </View>
        </View>
        <AttendanceReportModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          classId={classId}
          lessonId={lessonId}
          advanceMode={advanceMode}
        />
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
  viewRoomTime: {
    flex: 7,
  },
  viewItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  viewReport: {
    flexDirection: "row",
    alignItems: "center",
    flex: 3,
    justifyContent: "flex-end",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  viewDelete: {
    backgroundColor: "#f52222",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: "100%",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  viewApprove: {
    backgroundColor: "#4DC591",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: "100%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  btnAction: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    padding: 10,
  },
});
