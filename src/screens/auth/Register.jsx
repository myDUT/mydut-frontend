import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Register() {
  const navigation = useNavigation();
  const { top: paddingTop } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop }]}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.btnBack}
      >
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color={"#000000"}
          style={{ fontWeight: "600" }}
        />
      </TouchableOpacity>
      <Text style={styles.txtLogin}>Register</Text>
      <Text style={styles.txtDescription}>
        Enter your information to register
      </Text>
      <TextInput style={styles.input} placeholder="Username" />
      <TextInput style={styles.input} placeholder="Fullname" />
      <TextInput style={styles.input} placeholder="Student code" />
      <TextInput style={styles.input} placeholder="Homeroom class" />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
      />
      <TextInput style={styles.input} placeholder="Email" />
      <TouchableOpacity style={styles.bthLogin}>
        <Text style={styles.bthLoginText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.viewRegister}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.bthRegister}>Login</Text>
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
  btnBack: {
    marginLeft: -12,
    marginTop: 12,
    marginBottom: 16,
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
    backgroundColor: "#f78a32",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  bthLoginText: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
  },
  viewRegister: {
    flexDirection: "row",
    marginTop: 12,
    gap: 6,
    justifyContent: "center",
  },
  bthRegister: {
    color: "#f78a32",
    fontWeight: "bold",
  },
});
