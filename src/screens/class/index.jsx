import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Header from "./components/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ClassCard from "./components/ClassCard";
import { getClassList } from "../../mock/data_mock";
import NewClassBtn from "./components/NewClassBtn";
import { useCallback, useEffect, useState } from "react";
import { getListClassByUser } from "../../api/class_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ROLE } from "../../enum/RoleEnum";
import Modal from "react-native-modal";
import { formatTimestampToHHmm } from "../../utils/DateUtils";
import moment from "moment";
import { enrollInClass } from "../../api/enroll_api";
import Toast from "react-native-toast-message";

export default function Class() {
  const { top: paddingTop } = useSafeAreaInsets();
  const navigation = useNavigation();

  const dayOfWeekMap = {
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
    6: "Friday",
    7: "Saturday",
  };

  const [classListByUser, setClassListByUser] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [modalEnrollClassVisible, setModalEnrollClassVisible] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getRoleName = async () => {
      try {
        const role = await AsyncStorage.getItem("roleName");
        setRoleName(role);
      } catch (error) {}
    };
    getRoleName();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchListClassByUser();
    }, [])
  );

  const fetchListClassByUser = async () => {
    try {
      const result = await getListClassByUser();
      if (result.data.success === true) {
        setClassListByUser(transformList(result.data.data));
      } else {
        console.log("Error when creat new class", result.data);
      }
    } catch (error) {}
  };

  const transformList = (list) => {
    // Initialize the result with all days of the week
    const result = {};
    for (let i = 1; i <= 7; i++) {
      const dayOfWeek = dayOfWeekMap[i];
      result[dayOfWeek] = {
        dayOfWeek: dayOfWeek,
        data: [],
      };
    }

    list.forEach((item) => {
      const dayOfWeek = dayOfWeekMap[item.dayOfWeek];

      /* ONLY SHOW DAY HAVE CLASS */

      // if (!result[dayOfWeek]) {
      //   result[dayOfWeek] = {
      //     dayOfWeek: dayOfWeek,
      //     data: [],
      //   };
      // }

      result[dayOfWeek].data.push({
        name: item.className,
        classId: item.classId,
        room: item.roomName,
        roomId: item.roomId,
        lecturer: item.lecturer || null,
        totalStudent: item.totalStudent || 0,
        timeFrom: item.timeFrom,
        timeTo: item.timeTo,
        dateFrom: item.dateFrom,
        dateTo: item.dateTo,
        dayOfWeek: item.dayOfWeek,
        classCode: item.classCode,
      });
    });

    // Sort the data for each day by timeFrom, then by timeTo if timeFrom is equal
    Object.keys(result).forEach((dayOfWeek) => {
      result[dayOfWeek].data.sort((a, b) => {
        const timeFromA = moment(a.timeFrom).format("HH:mm");
        const timeFromB = moment(b.timeFrom).format("HH:mm");

        if (timeFromA < timeFromB) return -1;
        if (timeFromA > timeFromB) return 1;

        // If timeFrom same, compare timeTo
        const timeToA = moment(a.timeTo).format("HH:mm");
        const timeToB = moment(b.timeTo).format("HH:mm");

        if (timeToA < timeToB) return -1;
        if (timeToA > timeToB) return 1;

        return 0;
      });
    });

    return Object.values(result);
  };

  const renderModalEnrollClass = () => {
    const showSuccessEnroll = () => {
      Toast.show({
        type: "success",
        text1: "Notification",
        text2: "Successfully. Please wait for the lecturer's approval.",
      });
    };

    const showFailedEnroll = (message) => {
      Toast.show({
        type: "error",
        text1: "Notification",
        text2: message || "An error has occurred. Please try again later.",
      });
    };

    const handleEnroll = async () => {
      try {
        setIsLoading(true);
        const result = await enrollInClass({ classCode: classCode });

        result.data.success === true
          ? showSuccessEnroll()
          : showFailedEnroll(result?.data?.message);
        setModalEnrollClassVisible(!modalEnrollClassVisible);
      } catch (error) {
        setModalEnrollClassVisible(!modalEnrollClassVisible);
      } finally {
        setIsLoading(false);
        setClassCode("");
      }
    };

    return (
      <Modal
        isVisible={modalEnrollClassVisible}
        onBackdropPress={() => {
          setClassCode("");
          setModalEnrollClassVisible(!modalEnrollClassVisible);
        }}
        style={styles.modalEnrollClass}
        // customBackdrop={<View style={{ flex: 1, height: 200 }} />}
      >
        <View style={styles.viewModalEnrollClass}>
          {/* <Text style={styles.txtModalEnrollClass}>
            Input code to enroll in the class.
          </Text> */}
          <TextInput
            style={styles.txtClassCode}
            placeholder="Enter code to enroll in the class."
            onChangeText={setClassCode}
            value={classCode}
          />
          <TouchableOpacity
            onPress={() => handleEnroll()}
            style={styles.btnEnroll}
          >
            {!isLoading ? (
              <Text style={{ fontSize: 18, fontWeight: "600", color: "white" }}>
                Enroll Now
              </Text>
            ) : (
              <ActivityIndicator size={"small"} color={"#FF7648"} />
            )}

            {/* <ActivityIndicator size={"large"} color={"red"} /> */}
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <Header />
      <SectionList
        style={styles.sessionList}
        sections={classListByUser}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item: classItem }) => {
          return <ClassCard classInfo={classItem} />;
        }}
        renderSectionHeader={({ section: { dayOfWeek } }) => (
          <Text style={styles.headerSessionList}>{dayOfWeek}</Text>
        )}
        stickySectionHeadersEnabled
      />
      {roleName === ROLE.TEACHER && (
        <NewClassBtn onPress={() => navigation.navigate("AddNewClass")} />
      )}
      {roleName === ROLE.STUDENT && (
        <NewClassBtn
          onPress={() => setModalEnrollClassVisible(!modalEnrollClassVisible)}
        />
      )}
      {renderModalEnrollClass()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sessionList: {
    marginTop: 16,
  },
  headerSessionList: {
    fontSize: 24,
    backgroundColor: "#FF7648",
    paddingVertical: 2,
    paddingHorizontal: 5,
    color: "#FFF",
    fontWeight: "500",
    letterSpacing: 1.3,
    marginVertical: 2,
  },
  title: {
    fontSize: 24,
  },

  // Style Modal Enroll Class
  modalEnrollClass: {
    // flex: 1,
  },
  viewModalEnrollClass: {
    // flex: 0.2,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  btnEnroll: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 150,
    // borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f38933dd",
    marginTop: 20,
    marginBottom: 20,
    // marginBottom: 30,
  },
  txtModalEnrollClass: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "500",
  },
  txtClassCode: {
    height: 50,
    fontSize: 16,
    marginTop: 18,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
