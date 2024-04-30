import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import moment from "moment";

export default function CurrentDate() {
  const currentDate = moment();
  const dayOfWeek = currentDate.format("dddd"); // Lấy thứ trong tuần (Monday, Tuesday, ...)
  const dayOfMonth = currentDate.format("D"); // Lấy ngày trong tháng (1, 2, ..., 31)
  const monthYear = currentDate.format("MMM YYYY"); // Lấy tên tháng (January, February, ...)
  return (
    <View style={styles.viewRoot}>
      <View style={styles.viewCurrentDate}>
        <Text style={styles.txtDayOfMonth}>{dayOfMonth}</Text>
        <View style={styles.viewSubDate}>
          <Text style={styles.txtSubDate}>{dayOfWeek}</Text>
          <Text style={styles.txtSubDate}>{monthYear}</Text>
        </View>
      </View>
      <View style={styles.viewBtnToday}>
        <TouchableOpacity>
          <Text style={styles.txtToday}>Today</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  viewRoot: {
    marginTop: 20,
    marginLeft: 30,
    height: 60,
    flexDirection: "row",
  },
  viewCurrentDate: {
    flex: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  viewBtnToday: {
    flex: 2,
    justifyContent: "center",
    backgroundColor: "#daf1e7",
    width: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  txtDayOfMonth: {
    fontSize: 45,
    fontWeight: "bold",
  },
  viewSubDate: {
    marginLeft: 10,
    justifyContent: "center",
  },
  txtSubDate: {
    color: "#848586",
  },
  txtToday: {
    color: "#6ac29a",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
