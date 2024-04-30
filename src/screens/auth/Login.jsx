import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Login() {
  const navigation = useNavigation();

  const { top: paddingTop } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop }]}>
      <Text style={styles.txtLogin}>Login</Text>
      <Text style={styles.txtDescription}>Enter your credentials to login</Text>
      <TextInput style={styles.input} placeholder="Username" />
      <TextInput style={styles.input} placeholder="Password" />
      <TouchableOpacity
        onPress={() => navigation.navigate("App")}
        style={styles.bthLogin}
      >
        <Text style={styles.bthLoginText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.viewRegister}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.btnRegister}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
  },
  txtLogin: {
    fontSize: 30,
    fontWeight: "700",
  },
  txtDescription: {
    marginTop: 12,
  },
  input: {
    height: 45,
    marginTop: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  bthLogin: {
    marginTop: 24,
    backgroundColor: "#4DC591",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  bthLoginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  viewRegister: {
    flexDirection: "row",
    marginTop: 12,
    gap: 6,
    justifyContent: "center",
  },
  btnRegister: {
    color: "#4DC591",
    fontWeight: "bold",
  },
});
