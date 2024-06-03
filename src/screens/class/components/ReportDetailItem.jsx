import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";

export default function ReportDetailItem({ data }) {
  const {
    fullName,
    studentCode,
    homeroomClass,
    timeIn,
    isValidCheckIn,
    isFacialRecognition,
    distance,
  } = data;

  return (
    <View style={styles.container}>
      <View style={styles.viewFullname}>
        <Text style={styles.txtFullname}>{fullName}</Text>
        {isValidCheckIn && (
          <Ionicons
            name="location-sharp"
            size={20}
            color="#4caf50"
            style={styles.icon}
          />
        )}
        {isFacialRecognition && (
          <Ionicons
            name="eye-sharp"
            size={20}
            color="#4caf50"
            style={styles.icon}
          />
        )}
        {!isValidCheckIn && !isFacialRecognition && (
          <Ionicons
            name="close-circle"
            size={20}
            color="#f44336"
            style={styles.icon}
          />
        )}
      </View>
      <View style={styles.viewExtraInfo}>
        <Text style={styles.txtLabel}>Student Code:</Text>
        <Text style={styles.txtValue}>{studentCode}</Text>
      </View>
      <View style={styles.viewExtraInfo}>
        <Text style={styles.txtLabel}>Class:</Text>
        <Text style={styles.txtValue}>{homeroomClass}</Text>
      </View>
      <View style={styles.viewExtraInfo}>
        <Text style={styles.txtLabel}>Time In:</Text>
        {timeIn && (
          <Text style={styles.txtValue}>
            {moment(timeIn).format("YYYY-MM-DD HH:mm:SS")}
          </Text>
        )}
      </View>
      {/* <View style={styles.viewExtraInfo}>
        <Text style={styles.txtLabel}>Facial Recognition:</Text>
        <Text style={styles.txtValue}>
          {isFacialRecognition ? "Yes" : "No"}
        </Text>
      </View> */}
      <View style={styles.viewExtraInfo}>
        <Text style={styles.txtLabel}>Distance (m):</Text>
        <Text style={styles.txtValue}>{distance?.toFixed(2)}</Text>
      </View>
    </View>
  );
  console.log(
    "🚀 ~ ReportDetailItem ~ isFacialRecognition:",
    isFacialRecognition
  );
  console.log(
    "🚀 ~ ReportDetailItem ~ isFacialRecognition:",
    isFacialRecognition
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
  viewFullname: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  txtFullname: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  icon: {
    fontWeight: "600",
  },
  viewExtraInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  txtLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  txtValue: {
    fontSize: 14,
    color: "#333",
  },
});
