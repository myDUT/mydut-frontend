import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Login() {
  const { top: paddingTop } = useSafeAreaInsets();
  const navigation = useNavigation();

  const passwordInputRef = useRef(null); // Tham chiếu đến TextInput cho mật khẩu

  const handleLogin = () => {
    navigation.navigate("App");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ImageBackground
        source={require("../../../assets/background_login.png")}
        style={styles.background}
      />
      <View style={styles.contentContainer}>
        <View style={styles.viewLogin}>
          <Text style={styles.txtLogin}>Login</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Username"
          returnKeyType="next" // Đặt kiểu phím trả về cho TextInput này thành "Next"
          onSubmitEditing={() => passwordInputRef.current.focus()} // Khi người dùng nhấn "Done", chuyển con trỏ đến TextInput cho mật khẩu
        />
        <TextInput
          ref={passwordInputRef} // Gán tham chiếu cho TextInput cho mật khẩu
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          returnKeyType="done" // Đặt kiểu phím trả về cho TextInput này thành "Done"
          onSubmitEditing={() => handleLogin()}
        />
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-around",
  },
  background: {
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    flex: 1,
    paddingTop: 70,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  viewLogin: {
    paddingTop: 12,
    alignItems: "center",
  },
  txtLogin: {
    fontSize: 30,
    fontWeight: "700",
    color: "#f78a32",
  },
  input: {
    height: 45,
    marginTop: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
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
  btnRegister: {
    color: "#f78a32",
    fontWeight: "bold",
  },
});
