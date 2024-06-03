import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ReportItem({ data }) {
  const {
    userId,
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
        {(isValidCheckIn || isFacialRecognition) && (
          <Ionicons
            name="checkmark-circle"
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
        <Text style={styles.txtStudentCode}>{studentCode}</Text>
        <Text style={styles.txtClassName}>{homeroomClass}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 6,
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  viewFullname: {
    flexDirection: "row",
    marginLeft: 24,
    flex: 9,
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  txtFullname: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  viewExtraInfo: {
    marginRight: 20,
    flex: 4,
    gap: 4,
    alignItems: "flex-end",
  },
  txtStudentCode: {
    fontSize: 13,
    color: "#555",
  },
  txtClassName: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
});
