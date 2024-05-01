import { StyleSheet, Text, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.viewHeader}>
      <Text style={styles.txtHeader}>Class</Text>
      <Text style={styles.txtDesc}>
        A list of the classes you have joined in this semester, providing an
        overview of the classes and related activities.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  viewHeader: {
    marginTop: 12,
    gap: 8,
  },
  txtHeader: {
    fontSize: 45,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  txtDesc: {
    marginRight: -8,
    lineHeight: 16,
    fontWeight: "400",
  },
});
