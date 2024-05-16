import { View, Text, StyleSheet, SectionList } from "react-native";
import Header from "./components/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ClassCard from "./components/ClassCard";
import { getClassList } from "../../mock/data_mock";
import NewClassBtn from "./components/NewClassBtn";
import { useEffect, useState } from "react";
import { getListClassByUser } from "../../api/class_api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Class() {
  const { top: paddingTop } = useSafeAreaInsets();

  const dayOfWeekMap = {
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
    6: "Friday",
    7: "Saturday",
  };

  // const classListByUserMock = getClassList();
  const [classListByUser, setClassListByUser] = useState([]);
  const [isTeacher, setIsTeacher] = useState(true);

  useEffect(() => {
    getListClassByUser()
      .then((response) => {
        return setClassListByUser(transformList(response.data.data));
      })
      .catch((error) => {});

    const getRoleName = async () => {
      try {
        const role = await AsyncStorage.getItem("roleName");
        setIsTeacher(role === "TEACHER");
      } catch (error) {}
    };
    getRoleName();
  }, []);

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

    return Object.values(result);
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
      {isTeacher && <NewClassBtn />}
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
});
