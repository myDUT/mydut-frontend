import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
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
  ActivityIndicator,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { user_login } from "../../api/user_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "../SplashScreen";

export default function Login() {
  const { top: paddingTop } = useSafeAreaInsets();
  const navigation = useNavigation();

  const passwordInputRef = useRef(null); // Tham chiếu đến TextInput cho mật khẩu

  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const keys = await AsyncStorage.getAllKeys();
        // const data = await AsyncStorage.multiGet(keys);
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (accessToken) {
          navigation.navigate("App");
        } else {
          setIsLogin(!isLogin);
        }

        console.log("AccessToken in AsyncStorage:", accessToken);
      } catch (error) {
        console.error("Can't get AccessToken from AsyncStorage:", error);
      }
    };
    fetchData(); // Gọi hàm async ở đây
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    user_login({
      username: username,
      password: password,
    })
      .then(async (response) => {
        if (response.status == 200) {
          await AsyncStorage.setItem(
            "accessToken",
            response.data.data.accessToken
          );
          await AsyncStorage.setItem(
            "refreshToken",
            response.data.data.refreshToken
          );
          await AsyncStorage.setItem("userName", response.data.data.username);
          await AsyncStorage.setItem("fullName", response.data.data.fullName);
          await AsyncStorage.setItem("roleName", response.data.data.roleName);
          await AsyncStorage.setItem(
            "principal",
            JSON.stringify(response.data.data)
          );

          setIsLoading(false);
          navigation.navigate("App");

          // console.log(
          //   "🚀 ~ handleLogin ~ access_token:",
          //   response.data.data.accessToken
          // );
          // console.log("🚀 ~ handleLogin ~ role:", response.data.data.roleName);
        } else {
          // console.log("🚀 ~ handleLogin ~ response:", response)
          setIsLoading(false);
          Alert.alert("Username or password is incorrect. Please check again.");
        }
        setUsername("");
        setPassword("");
      })
      .catch((error) => {
        console.log("🚀 ~ handleLogin ~ error:", error);
        setUsername("");
        setPassword("");
        setIsLoading(false);
        Alert.alert("An error has occurred. Please try again later.");
      });
  };

  return (
    isLogin && (
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
            onChangeText={setUsername}
            value={username}
          />
          <TextInput
            ref={passwordInputRef} // Gán tham chiếu cho TextInput cho mật khẩu
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            returnKeyType="done" // Đặt kiểu phím trả về cho TextInput này thành "Done"
            onSubmitEditing={() => handleLogin()}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity
            onPress={() => handleLogin()}
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
        {/* {renderLoading()} */}
        <SplashScreen isDisplay={isLoading} />
      </KeyboardAvoidingView>
    )
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
