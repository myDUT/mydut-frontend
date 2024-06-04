import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Setting() {
  const { top: paddingTop } = useSafeAreaInsets();
  const navigation = useNavigation();

  const onLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("fullName");
    await AsyncStorage.removeItem("roleName");
    await AsyncStorage.removeItem("principal");

    navigation.replace("Login");
  };

  return (
    <ScrollView style={[styles.container, { paddingTop }]}>
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
            <Text style={styles.headerText}>Lương Ngọc Đạt</Text>
            <Ionicons
              name="create-outline"
              size={20}
              color="white"
              style={styles.editIcon}
            />
          </View>
        </View>
        <Text style={styles.phoneNumber}>0964509757</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="create-outline"
            size={20}
            color="red"
            style={styles.editIcon}
          />
          <Text style={styles.menuItemText}>Quy chế hoạt động</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Cài đặt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Hỗ trợ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => onLogout()}>
          <Text style={styles.menuItemText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.companyInfoContainer}>
        <Text style={styles.companyInfoText}>
          CÔNG TY CP DV VẬN TẢI TÂN KIM CHI
        </Text>
        <Text style={styles.companyInfoText}>
          Địa Chỉ Đà Nẵng: Quầy số 22A Bến Xe Đà Nẵng
        </Text>
        <Text style={styles.companyInfoText}>
          58 Thanh Tịnh, Hòa Minh, Liên Chiểu, Đà Nẵng
        </Text>
        <Text style={styles.companyInfoText}>94 Đường Mai Anh Đào, Đà Lạt</Text>
        <Text style={styles.companyInfoText}>Bến xe Nước Ngầm, Hà Nội</Text>
        <Text style={styles.companyInfoText}>Bến xe Yên Nghĩa, Hà Nội</Text>
        <Text style={styles.companyInfoText}>
          Nơ 21 KĐT Pháp Vân, Q. Hoàng Mai, Hà Nội
        </Text>
        <Text style={styles.companyInfoText}>093 459 7597</Text>
        <Text style={styles.companyInfoText}>093 159 7597</Text>
        <Text style={styles.companyInfoText}>19005151</Text>
        <Text style={styles.companyInfoText}>tankimchidhnn@gmail.com</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    backgroundColor: "#f38933dd",
    padding: 20,
    alignItems: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerContent: {
    marginLeft: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  editIcon: {
    marginLeft: 10,
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
    borderRadius: 40,
  },
  menuContainer: {
    marginVertical: 20,
  },
  menuItem: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  menuItemText: {
    fontSize: 16,
  },
  companyInfoContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  companyInfoText: {
    fontSize: 14,
    marginVertical: 2,
  },
});
