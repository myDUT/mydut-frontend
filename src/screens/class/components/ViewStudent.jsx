import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import StudentItem from "./StudentItem";
import ItemSeparator from "./ItemSeparator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  actionWithEnrollment,
  getAllEnrolledStudentInClass,
  getNumberWaitingEnrollment,
} from "../../../api/enroll_api";
import SplashScreen from "../../SplashScreen";
import Toast from "react-native-toast-message";
export default function ViewStudent() {
  const route = useRoute();
  const [studentList, setStudentList] = useState([]);
  const [roleName, setRoleName] = useState("");

  const { top: paddingTop } = useSafeAreaInsets();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [reloadStudentList, setReloadStudentList] = useState(false);

  const openSwipeableRef = useRef(null);

  const receivedData = route.params?.data || null;

  const closeOpenSwipeable = () => {
    if (openSwipeableRef.current) {
      openSwipeableRef.current.close();
      openSwipeableRef.current = null;
    }
  };

  useEffect(() => {
    getRoleName();
    fetchListEnrolledStudent();
    setIsFirstLoad(false);
  }, []);

  useEffect(() => {
    if (!isFirstLoad) {
      fetchListEnrolledStudent();
    }
  }, [reloadStudentList]);

  const getRoleName = async () => {
    try {
      const roleName = await AsyncStorage.getItem("roleName");
      setRoleName(roleName);
    } catch (error) {}
  };

  const fetchListEnrolledStudent = async () => {
    try {
      const result = await getAllEnrolledStudentInClass(receivedData);
      if (result.data.success === true) {
        setStudentList(result?.data?.data || []);
      } else {
        console.log(
          "Error when fetch all enrolled student in class",
          result.data
        );
      }
    } catch (error) {}
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

  const handleActionStudent = (userId, fullName, actionType) => {
    Alert.alert(
      "Confirm",
      `Are you sure you want to ${
        actionType === 1 ? "approve" : "reject"
      } ${fullName} for the class?`,
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
            if (!!userId) {
              const action_request = {
                classId: receivedData,
                actionType: actionType,
                userIds: [userId],
              };
              try {
                const result = await actionWithEnrollment(action_request);
                if (result.data.success === true) {
                  if (actionType === 1) {
                    showSuccessToast(
                      `Successfully approved ${fullName} for the class.`
                    );
                  } else {
                    showSuccessToast(
                      `Successfully rejected ${fullName} from the class.`
                    );
                  }
                  setReloadStudentList(!reloadStudentList);
                } else {
                  showFailedToast(
                    `An error has occurred. Please try again later.`
                  );
                }
              } catch (error) {
                showFailedToast(
                  `An error has occurred. Please try again later.`
                );
              } finally {
                setIsLoading(false);
              }
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop }]}>
        <View style={styles.viewTopBtn}>
          <TouchableOpacity
            onPress={() => navigation.navigate("DetailClass")}
            style={styles.btnBack}
          >
            <Ionicons
              name="chevron-back-outline"
              size={24}
              color={"#000000"}
              style={{ fontWeight: "600" }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.btnMore}>
            <Ionicons
              name="ellipsis-vertical-outline"
              size={24}
              color={"#000000"}
              style={{ fontWeight: "600" }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.viewHeader}>
          <View>
            <Text style={styles.txtHeader}>Student List</Text>
            <Text style={styles.txtDesc}>
              A complete list of currently enrolled students in the class and
              students needing approval.
            </Text>
          </View>
        </View>
        <View style={styles.viewContent}>
          <FlatList
            scrollEnabled={true}
            vertical
            onRefresh={() => {
              setReloadStudentList(!reloadStudentList);
            }}
            refreshing={isLoading}
            data={studentList}
            renderItem={({ item }) => (
              <StudentItem
                data={item}
                roleName={roleName}
                openSwipeableRef={openSwipeableRef}
                closeOpenSwipeable={closeOpenSwipeable}
                handleActionStudent={handleActionStudent}
              />
            )}
            keyExtractor={(item) => item.enrollmentId}
            ItemSeparatorComponent={ItemSeparator}
            // ListEmptyComponent={<EmptyListComponent />}
          />
        </View>
      </View>
      {/* <SplashScreen isDisplay={isLoading} /> */}
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flex: 1,
  },
  viewTopBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnBack: {
    marginLeft: -12,
    marginTop: 12,
    marginBottom: 8,
  },
  btnMore: {
    marginTop: 12,
    marginBottom: 8,
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
  viewContent: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 12,
    marginHorizontal: -12,
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    borderBottomWidth: 0,
  },
});
