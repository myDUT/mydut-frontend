import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import InfoClass from "./InfoClass";
import { addNewClass } from "../../../api/class_api";
import Toast from "react-native-toast-message";
import SplashScreen from "../../SplashScreen";

export default function AddNewClass() {
  const navigation = useNavigation();
  const { top: paddingTop } = useSafeAreaInsets();

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBackdropPress = () => {
    Keyboard.dismiss(); // Hide keyboard
  };

  const handleSaveClass = async () => {
    // TODO: call API save class
    const showSuccessCreateUserToast = () => {
      Toast.show({
        type: "success",
        text1: "Notification",
        text2: "Create new class successfully.",
      });
    };

    const showFailedCreateUser = () => {
      Toast.show({
        type: "error",
        text1: "Notification",
        text2: "An error has occurred. Please try again later.",
      });
    };

    try {
      setIsLoading(true);
      const result = await addNewClass(formData);

      result.data.success === true
        ? showSuccessCreateUserToast()
        : showFailedCreateUser();

      navigation.navigate("ClassList");
    } catch (error) {
      showFailedCreateUser();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={handleBackdropPress}
      activeOpacity={1}
    >
      <View style={[styles.container, { paddingTop }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ClassList")}
          style={styles.btnBack}
        >
          <Ionicons
            name="chevron-back-outline"
            size={24}
            color={"#000000"}
            style={{ fontWeight: "600" }}
          />
        </TouchableOpacity>
        <View style={styles.viewHeader}>
          <View>
            <Text style={styles.txtHeader}>New class</Text>
            {/* <Text style={styles.txtHeader}>New happiness</Text> */}
          </View>
          <Text style={styles.txtDesc}>
            Enter relevant information to create a new class.
          </Text>
        </View>
        <InfoClass onFormSubmit={(data) => setFormData(data)} />
      </View>
      <TouchableOpacity activeOpacity={0.7} onPress={() => handleSaveClass()}>
        <LinearGradient
          style={styles.btnConfirm}
          // Button Linear Gradient
          colors={["#f78a32", "#e7b96a"]}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: 24,
              // letterSpacing: 0.7,
            }}
          >
            Save
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <SplashScreen isDisplay={isLoading} />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flex: 1,
  },
  btnBack: {
    marginLeft: -12,
    marginTop: 12,
    marginBottom: 16,
  },
  viewHeader: {},
  txtLabel: {
    fontSize: 16,
    letterSpacing: 0.9,
  },
  txtHeader: {
    fontSize: 45,
    fontWeight: "600",
    lineHeight: 45,
  },
  txtDesc: {
    fontSize: 16,
    fontWeight: "400",
    color: "#848586",
    marginBottom: 26,
  },
  viewBody: {
    gap: 12,
  },
  viewTxtInput: {
    gap: 3,
    // marginTop: 3,
  },
  txtInput: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  // Style DropDown
  viewRoomAndDay: {
    flexDirection: "row",
    gap: 12,
  },

  viewDropDown: {
    // backgroundColor: "white",
    // padding: 16,
    marginTop: 10,
    flex: 1,
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  viewTime: {
    // flex: 1,
    flexDirection: "row",
    gap: 12,
    paddingTop: 4,
  },
  btnDateFrom: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  btnDateTo: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  labelPicker: {
    paddingLeft: 6,
    marginTop: -12,
    color: "#848586",
  },
  viewPicker: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btnConfirm: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 15,
  },
});
