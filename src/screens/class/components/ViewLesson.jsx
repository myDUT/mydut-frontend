import { Alert, StyleSheet, Text, View } from "react-native";
import {
  FlatList,
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LessonItem from "./LessonItem";
import { getAllLessonsInClass } from "../../../api/lesson_api";

export default function ViewLesson() {
  const { top: paddingTop } = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();

  const [lessonList, setLessonList] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const openSwipeableRef = useRef(null);

  // receivedData is classId
  const receivedData = route.params?.data || null;

  const closeOpenSwipeable = () => {
    if (openSwipeableRef.current) {
      openSwipeableRef.current.close();
      openSwipeableRef.current = null;
    }
  };

  useEffect(() => {
    getRoleName();
    fetchListLessonsInClass();
    setIsFirstLoad(false);
  }, []);

  useEffect(() => {
    if (!isFirstLoad) {
      fetchListEnrolledStudent();
    }
  }, [isLoading]);

  const getRoleName = async () => {
    try {
      const roleName = await AsyncStorage.getItem("roleName");
      setRoleName(roleName);
    } catch (error) {}
  };

  const fetchListLessonsInClass = async () => {
    try {
      const result = await getAllLessonsInClass(receivedData);
      if (result.data.success === true) {
        setLessonList(result?.data?.data?.items || []);
      }
    } catch (error) {
      console.log("Error when fetch data for view lessons in class", error);
    }
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
            <Text style={styles.txtHeader}>Lesson List</Text>
            <Text style={styles.txtDesc}>
              A complete list of all class sessions from the start-date to the
              end-date, along with attendance details for each session.
            </Text>
          </View>
        </View>
        <View style={styles.viewContent}>
          <FlatList
            scrollEnabled={true}
            vertical
            // onRefresh={() => {
            //   setIsLoading(!isLoading);
            // }}
            // refreshing={isLoading}
            data={lessonList}
            renderItem={({ item }) => (
              <LessonItem
                data={item}
                roleName={roleName}
                openSwipeableRef={openSwipeableRef}
                closeOpenSwipeable={closeOpenSwipeable}
                // handleActionStudent={handleActionStudent}
              />
            )}
            keyExtractor={(item) => item.lessonId}
            // ItemSeparatorComponent={ItemSeparator}
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
    fontSize: 14,
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomWidth: 0,
    // paddingTop: 12,
  },
});
