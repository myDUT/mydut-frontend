import { ActivityIndicator, StyleSheet, Text } from "react-native";
import Modal from "react-native-modal";

export default function SplashScreen({ isDisplay }) {
  return (
    <Modal isVisible={isDisplay} style={{ flex: 1 }}>
      <ActivityIndicator size={"large"} color={"#f78a32"} />
    </Modal>
  );
}
const styles = StyleSheet.create({});
