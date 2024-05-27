import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { compareWithCurrentTime } from "../../../utils/DateUtils";

export default function LessonCard({ infoClass, onPress }) {
  const {
    datetimeFrom,
    datetimeTo,
    className,
    lecturer,
    roomName,
    presentStudent,
    totalStudent,
  } = infoClass;
  
  const getColorText = compareWithCurrentTime(datetimeFrom, datetimeTo)
    ? { color: "#FFFFFF" }
    : { color: "#212525" };

  const getColorIcon = compareWithCurrentTime(datetimeFrom, datetimeTo)
    ? "#FFFFFF"
    : "#212525";

  return (
    <TouchableOpacity
      disabled={!compareWithCurrentTime(datetimeFrom, datetimeTo)}
      style={[
        styles.lessonCard,
        compareWithCurrentTime(datetimeFrom, datetimeTo)
          ? { backgroundColor: "#4DC591" }
          : { backgroundColor: "#e0e0e0c5" },
      ]}
      onPress={onPress}
    >
      <View style={styles.viewHeader}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.txtClassName, getColorText]}
        >
          {className}
        </Text>
        <View style={styles.viewAttendence}>
          <Ionicons
            color={getColorIcon}
            style={styles.iconInfo}
            name="people-outline"
            size={18}
          />
          <Text style={[styles.txtAttendence, getColorText]}>
            {presentStudent || 0}/{totalStudent}
          </Text>
        </View>
      </View>
      <View style={styles.viewClassInfo}>
        <View style={styles.viewInfo}>
          <Ionicons
            color={getColorIcon}
            style={styles.iconInfo}
            name="location-outline"
            size={18}
          />
          <Text style={[styles.txtInfo, getColorText]}>{roomName}</Text>
        </View>
        <View style={styles.viewInfo}>
          <Ionicons
            color={getColorIcon}
            style={styles.iconInfo}
            name="person-outline"
            size={18}
          />
          <Text style={[styles.txtInfo, getColorText]}>
            {lecturer || "DUT's Lecturer"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  lessonCard: {
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 10,
    height: 120,
    marginBottom: 14,
    paddingHorizontal: 12,
    // backgroundColor: "#4DC591",
  },
  viewHeader: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 4,
    justifyContent: "space-between",
    alignItems: "center",
  },
  txtClassName: {
    fontWeight: "bold",
    width: 170,
    fontSize: 16,
    overflow: "hidden",
  },
  viewAttendence: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  txtAttendence: {
    fontSize: 14,
  },
  viewClassInfo: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 12,
    gap: 6,
  },
  viewInfo: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});
