import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { getUserById } from "../../api/user_api";

export default function Setting() {
  const { top: paddingTop } = useSafeAreaInsets();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState([]);

  const onLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("fullName");
    await AsyncStorage.removeItem("roleName");
    await AsyncStorage.removeItem("principal");

    navigation.replace("Login");
  };

  const fetchPersonalInfoByUserId = async () => {
    setIsLoading(true);
    const principal = await AsyncStorage.getItem("principal");
    const data = JSON.parse(principal);
    const userId = data?.userId;
    try {
      const result = await getUserById(userId);
      if (result.data.success === true) {
        setPersonalInfo(result?.data?.data || []);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalInfoByUserId();
  }, []);

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profilePic}>
            <Image
              style={styles.profilePicImage}
              source={{
                uri: "https://dut.udn.vn/Files/admin/images/Tin_tuc/Khac/2020/LogoDUT/image002.jpg",
              }}
            />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>{personalInfo["fullName"]}</Text>
            <View style={styles.headerSubContent}>
              {personalInfo["roleName"] === "STUDENT" && (
                <>
                  <Text style={styles.headerSubText}>
                    Student ID: {personalInfo["studentCode"]}
                  </Text>
                  <Text style={styles.headerSubText}>
                    Homeroom class: {personalInfo["homeroomClass"]}
                  </Text>
                </>
              )}
              {personalInfo["roleName"] !== "STUDENT" && (
                <>
                  <Text style={styles.headerSubText}>
                    Email: {personalInfo["email"]}
                  </Text>
                </>
              )}
            </View>
            {/* <Ionicons
              name="create-outline"
              size={20}
              color="white"
              style={styles.editIcon}
            /> */}
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="eye-outline"
            size={20}
            color="#f38933"
            style={styles.menuIcon}
          />
          <Text style={styles.menuItemText}>Facial Recognition Data</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color="#000"
            style={styles.rightIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="settings-outline"
            size={20}
            color="#f38933"
            style={styles.menuIcon}
          />
          <Text style={styles.menuItemText}>Settings</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color="#000"
            style={styles.rightIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="help-circle-outline"
            size={20}
            color="#f38933"
            style={styles.menuIcon}
          />
          <Text style={styles.menuItemText}>Support</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color="#000"
            style={styles.rightIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onLogout()}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#f38933"
            style={styles.menuIcon}
          />
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.companyInfoContainer}>
        <Text style={styles.companyInfoText}>CAPSTONE PROJECT K19 - myDUT</Text>
        <Text style={styles.companyInfoText}>
          Da Nang University of Science and Technology
        </Text>
        <Text style={styles.companyInfoText}>
          Address: 54 Nguyen Luong Bang, Hoa Khanh Bac Ward, Lien Chieu
          District, Da Nang
        </Text>
        <Text style={styles.companyInfoText}>
          Contact: 096 450 9757 - ngocdat1908@gmail.com
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#f38933",
    paddingHorizontal: 20,
    paddingVertical: 25,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerContent: {
    marginLeft: 15,
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    gap: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  headerSubContent: {
    flexDirection: "column",
  },
  headerSubText: {
    fontSize: 14,
    color: "white",
  },
  editIcon: {
    alignSelf: "flex-end",
  },
  phoneNumber: {
    fontSize: 16,
    color: "white",
    marginVertical: 5,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicImage: {
    width: 80,
    height: 80,
    // borderRadius: 40,
  },
  menuContainer: {
    marginVertical: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  rightIcon: {
    alignSelf: "flex-end",
  },
  companyInfoContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
    justifyContent: "flex-end",
    flex: 1,
  },
  companyInfoText: {
    fontSize: 14,
    marginVertical: 2,
    color: "#555",
    textAlign: "left",
  },
});
