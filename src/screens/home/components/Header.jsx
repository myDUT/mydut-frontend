import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
export default function Header() {
  const [fullName, setFullName] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = "";

    useEffect(() => {
      const getFullNameFromAsyncStorage = async () => {
        try {
          const value = await AsyncStorage.getItem("fullName");
          if (value !== null) {
            setFullName(value);
          }
        } catch (error) {
          console.error("Error when get data from AsyncStorage:", error);
        }
      };

      getFullNameFromAsyncStorage();
    }, []);

    if (hour >= 5 && hour < 12) {
      greeting = "Good morning!";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Good afternoon!";
    } else {
      greeting = "Good evening!";
    }
    return greeting;
  };

  return (
    <View style={styles.viewHeader}>
      <Image
        source={{
          uri: "https://dut.udn.vn/Files/admin/images/Tin_tuc/Khac/2020/LogoDUT/image002.jpg",
        }}
        style={styles.imgAvt}
      />
      <View>
        <Text style={styles.txtGreeting}>{getGreeting()}</Text>
        <Text style={styles.txtName}>Welcome back, {fullName}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  imgAvt: {
    height: 50,
    width: 50,
    // borderRadius: 999,
  },
  viewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 14,
  },
  txtGreeting: {
    fontSize: 20,
    fontWeight: "700",
  },
  txtName: {
    fontSize: 14,
    fontWeight: "400",
  },
});
