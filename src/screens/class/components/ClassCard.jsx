import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatTimestampToHHmm } from "../../../utils/DateUtils";
import { useNavigation } from "@react-navigation/native";

export default function ClassCard({ classInfo }) {
  const {
    name,
    classId,
    room,
    lecturer,
    timeFrom,
    timeTo,
    totalStudent,
    classCode,
  } = classInfo;
  const navigation = useNavigation();

  const handleViewDetailClass = () => {
    navigation.navigate("DetailClass", { data: classInfo });
  };

  return (
    <TouchableOpacity
      style={styles.classCard}
      onPress={() => handleViewDetailClass()}
    >
      <View style={styles.viewTop}>
        <View style={styles.viewNameAndTotal}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.txtClassName}
          >
            {name}
          </Text>
          <View style={styles.viewTotal}>
            <Ionicons
              style={styles.iconTotalStudent}
              name="people-outline"
              size={18}
            />
            <Text style={styles.txtTotalStudent}>{totalStudent}</Text>
          </View>
        </View>
        <View style={styles.viewClassCode}>
          <Ionicons style={styles.iconCode} name="qr-code-outline" size={18} />
          <Text style={styles.txtClassCode}>{classCode}</Text>
        </View>
      </View>
      <View style={styles.viewBottom}>
        <View style={{ flex: 1 }}></View>
        <View style={styles.viewRoomAndTime}>
          <View style={styles.viewInfo}>
            <Ionicons
              style={styles.iconInfo}
              name="location-outline"
              size={18}
            />
            <Text style={styles.txtInfo}>{room}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Ionicons style={styles.iconInfo} name="time-outline" size={18} />
            <Text style={styles.txtInfo}>
              {formatTimestampToHHmm(timeFrom)} -{" "}
              {formatTimestampToHHmm(timeTo)}
            </Text>
          </View>
        </View>
        {lecturer != null && (
          <View style={styles.viewLectucer}>
            <Ionicons style={styles.iconInfo} name="person-outline" size={18} />
            <Text style={styles.txtInfo}>{lecturer}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  classCard: {
    height: 120,
    marginLeft: 20,
    marginVertical: 6,
    paddingLeft: 12,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: "#e0e0e0fb",
  },

  viewTop: {
    flex: 3,
    paddingTop: 8,
    gap: 4,
  },
  txtClassName: {
    fontSize: 18,
    width: 250,
    fontWeight: "bold",
  },
  viewTotal: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    paddingRight: 10,
  },
  viewNameAndTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  txtTotalStudent: {
    fontSize: 16,
    fontWeight: "600",
  },
  viewClassCode: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  txtClassCode: {
    fontSize: 16,
    fontWeight: "500",
  },
  viewBottom: {
    flex: 4,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  viewRoomAndTime: {
    flexDirection: "row",
    flex: 2,
  },
  viewInfo: {
    flexDirection: "row",
    gap: 6,
    flex: 2,
    alignItems: "center",
  },
  viewLectucer: {
    flexDirection: "row",
    gap: 6,
    flex: 2,
    alignItems: "center",
    paddingBottom: 5,
  },
});
