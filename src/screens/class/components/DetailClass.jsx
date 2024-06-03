import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import InfoClass from "./InfoClass";
import { useCallback, useEffect, useState } from "react";
import SplashScreen from "../../SplashScreen";
import { deleteClass, updateClass } from "../../../api/class_api";
import Toast from "react-native-toast-message";
import { getNumberWaitingEnrollment } from "../../../api/enroll_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ROLE } from "../../../enum/RoleEnum";

export default function DetailClass() {
  const { top: paddingTop } = useSafeAreaInsets();

  const route = useRoute();
  const navigation = useNavigation();
  const [formData, setFormData] = useState(null);
  const [numberWaitingEnrollment, setNumberWaitingEnrollment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roleName, setRoleName] = useState("");

  const receivedData = route.params?.data || null;

  useEffect(() => {
    fetchNumberWaitingEnrollment();
    getRoleName();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNumberWaitingEnrollment();
    }, [])
  );

  const handleBackdropPress = () => {
    Keyboard.dismiss();
  };

  const showSuccessToast = (msg) => {
    Toast.show({
      type: "success",
      text1: "Notification",
      text2: msg || "Successfully.",
    });
  };

  const showFailedToast = (msg) => {
    Toast.show({
      type: "error",
      text1: "Notification",
      text2: msg || "Failed.",
    });
  };

  const fetchNumberWaitingEnrollment = async () => {
    try {
      const classId = receivedData.classId;
      const result = await getNumberWaitingEnrollment(classId);
      if (result.data.success === true) {
        setNumberWaitingEnrollment(result?.data?.data || null);
      } else {
        console.log(
          "Error when fetch number waiting enrollment in class",
          result.data
        );
      }
    } catch (error) {}
  };

  const getRoleName = async () => {
    try {
      const roleName = await AsyncStorage.getItem("roleName");
      setRoleName(roleName);
    } catch (error) {}
  };

  const handleUpdateClass = () => {
    Alert.alert(
      "Confirm",
      "Are you sure to update information for class?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            setIsLoading(true);
            if (!!formData?.classId) {
              try {
                const result = await updateClass(formData);
                if (result.data.success === true) {
                  showSuccessToast(
                    `Update class ${formData?.name} successfully.`
                  );
                } else {
                  showFailedToast(`Can't update class ${formData?.name}.`);
                }
              } catch (error) {
                showFailedToast(`Can't update class ${formData?.name}.`);
              } finally {
                setIsLoading(false);
                navigation.navigate("ClassList");
              }
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  const handleDeleteClass = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this class?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            setIsLoading(true);
            if (!!formData?.classId) {
              try {
                const result = await deleteClass(formData.classId);
                if (result.data.success === true) {
                  showSuccessToast(
                    `Delete class ${formData?.name} successfully.`
                  );
                } else {
                  showFailedToast(`Can't delete class ${formData?.name}.`);
                }
              } catch (error) {
                showFailedToast(`Can't delete class ${formData?.name}.`);
              } finally {
                setIsLoading(false);
                navigation.navigate("ClassList");
              }
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={handleBackdropPress}
      activeOpacity={1}
    >
      <View style={[styles.container, { paddingTop }]}>
        <View style={styles.viewTop}>
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
          {roleName === ROLE.TEACHER && (
            <TouchableOpacity
              onPress={() => {
                handleDeleteClass();
              }}
              style={styles.btnDelete}
            >
              <Ionicons
                name="trash-outline"
                size={28}
                color={"#ff0000"}
                style={{ fontWeight: "600" }}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.viewHeader}>
          <View>
            <Text style={styles.txtHeader}>Class Information</Text>
          </View>
          <Text style={styles.txtDesc}>
            Enter relevant information to update your class.
          </Text>
        </View>
        <View style={styles.funcView}>
          <View style={styles.qrcodeView}></View>
          <View style={styles.listFuncView}>
            <View style={styles.listView}>
              <TouchableOpacity
                style={styles.btnViewList}
                onPress={() =>
                  navigation.navigate("StudentList", { data: formData.classId })
                }
              >
                <Ionicons
                  name="people-outline"
                  size={18}
                  color={"#000000"}
                  style={{ fontWeight: "600" }}
                />
                <Text style={styles.btnText}>View Student</Text>
                {!!numberWaitingEnrollment && roleName === ROLE.TEACHER && (
                  <Text style={styles.txtNumberWaittingEnrollment}>
                    {numberWaitingEnrollment}
                  </Text>
                )}

                <Ionicons
                  name="arrow-forward-outline"
                  size={18}
                  color={"#000000"}
                  style={{ fontWeight: "600" }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.listView}>
              <TouchableOpacity
                style={styles.btnViewList}
                onPress={() =>
                  navigation.navigate("LessonList", { data: formData.classId })
                }
              >
                <Ionicons
                  name="newspaper-outline"
                  size={18}
                  color={"#000000"}
                  style={{ fontWeight: "600" }}
                />
                <Text style={styles.btnText}>View Lesson</Text>
                <Ionicons
                  name="arrow-forward-outline"
                  size={18}
                  color={"#000000"}
                  style={{ fontWeight: "600" }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <InfoClass
          initFormData={receivedData}
          onFormSubmit={(data) => setFormData(data)}
        />
      </View>
      {roleName === ROLE.TEACHER && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleUpdateClass()}
        >
          <LinearGradient
            style={styles.btnConfirm}
            colors={["#f78a32", "#e7b96a"]}
          >
            <Text style={styles.btnConfirmText}>Update</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <SplashScreen isDisplay={isLoading} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flex: 1,
  },
  viewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
  },
  btnBack: {
    marginLeft: -12,
    marginTop: 12,
    marginBottom: 8,
  },
  btnDelete: {
    marginTop: 12,
    marginBottom: 8,
    // marginRight: 8,
  },
  txtHeader: {
    fontSize: 35,
    fontWeight: "600",
    lineHeight: 45,
  },
  txtDesc: {
    fontSize: 16,
    fontWeight: "400",
    color: "#848586",
    marginBottom: 16,
  },
  btnConfirm: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 15,
  },
  btnConfirmText: {
    color: "white",
    fontWeight: "600",
    fontSize: 24,
  },
  funcView: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  qrcodeView: {
    flex: 3,
  },
  listFuncView: {
    flex: 3,
  },
  listView: {
    flexDirection: "row",
    marginBottom: 6, // Add some margin between items
  },
  btnViewList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly", // Ensure space between icons and text
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    backgroundColor: "#e0e0e0fb",
  },
  btnText: {
    flex: 1, // Take up the remaining space
    textAlign: "left", // Center the text
    paddingLeft: 8,
  },
  txtNumberWaittingEnrollment: {
    backgroundColor: "#f52222",
    color: "#fff",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "500",
    marginRight: 4,
  },
});
