import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatTimestampToHHmm } from "../../../utils/DateUtils";

export default function TimeCard({ timeClass }) {
  return (
    <View style={styles.viewTimeCard}>
      <Text style={styles.txtTimeFrom}>
        {formatTimestampToHHmm(timeClass.time_from)}
      </Text>
      <Text style={styles.txtTimeTo}>
        {formatTimestampToHHmm(timeClass.time_to)}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  viewTimeCard: {
    height: 120,
    alignItems: "center",
    gap: 4,
    paddingTop: 5,
  },
  txtTimeFrom: {
    fontSize: 20,
    fontWeight: "bold",
  },
  txtTimeTo: {
    color: "#848586",
    fontWeight: "800",
  },
});
