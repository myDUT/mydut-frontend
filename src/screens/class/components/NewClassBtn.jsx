import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function NewClassBtn(props) {
  return (
    <TouchableOpacity
      style={styles.btnAddClass}
      activeOpacity={0.7}
      onPress={props.onPress}
    >
      <Ionicons
        name="add-outline"
        size={18}
        color={"white"}
        style={{ fontWeight: "600" }}
      />
      <Text
        style={{
          color: "white",
          fontWeight: "700",
          fontSize: 18,
          // letterSpacing: 0.7,
        }}
      >
        New Class
      </Text>
      {/* <LinearGradient
        style={styles.btnAddClass}
        // Button Linear Gradient
        colors={["#f78a32", "#e7b96a"]}
      >
        <Ionicons
          name="add-outline"
          size={18}
          color={"white"}
          style={{ fontWeight: "600" }}
        />
        <Text
          style={{
            color: "white",
            fontWeight: "700",
            fontSize: 18,
            // letterSpacing: 0.7,
          }}
        >
          New Class
        </Text>
      </LinearGradient> */}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btnAddClass: {
    flexDirection: "row",
    position: "absolute",
    gap: 6,
    bottom: 10,
    right: 12,
    padding: 12,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "#f38933dd",
    // opacity: 0.9,
  },
});
