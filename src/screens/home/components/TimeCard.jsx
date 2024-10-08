import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatTimestampToHHmm } from "../../../utils/DateUtils";

export default function TimeCard({ timeClass }) {
  const { datetimeFrom, datetimeTo } = timeClass;
  return (
    <View style={styles.viewTimeCard}>
      <Text style={styles.txtTimeFrom}>
        {formatTimestampToHHmm(datetimeFrom)}
      </Text>
      <Text style={styles.txtTimeTo}>{formatTimestampToHHmm(datetimeTo)}</Text>
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
