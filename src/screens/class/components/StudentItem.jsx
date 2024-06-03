import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Swipeable } from "react-native-gesture-handler";
import { useEffect, useRef } from "react";
import { ROLE } from "../../../enum/RoleEnum";

export default function StudentItem({
  data,
  openSwipeableRef,
  closeOpenSwipeable,
  handleActionStudent,
  roleName,
}) {
  const swipeableRef = useRef(null);

  const {
    classId,
    userId,
    fullName,
    studentCode,
    homeroomClass,
    statusEnrollment,
  } = data;

  useEffect(() => {}, []);

  const renderRightActions = (progress, dragX) => {
    const scaleApprove = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 1, 0.8],
      extrapolate: "clamp",
    });

    const opacityApprove = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 1, 0],
      extrapolate: "clamp",
    });

    const scaleDelete = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 1, 0.8],
      extrapolate: "clamp",
    });

    const opacityDelete = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={{ flexDirection: "row" }}>
        {roleName == ROLE.TEACHER && statusEnrollment == 2 && (
          <Animated.View
            style={[
              styles.viewApprove,
              {
                transform: [{ scale: scaleApprove }],
                opacity: opacityApprove,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.btnAction}
              onPress={() => {
                handleActionStudent(userId, fullName, 1);
                swipeableRef.current.close();
              }}
            >
              <Ionicons
                name="checkmark-done-outline"
                size={28}
                color={"white"}
              />
            </TouchableOpacity>
          </Animated.View>
        )}
        {roleName == ROLE.TEACHER && (
          <Animated.View
            style={[
              styles.viewDelete,
              { transform: [{ scale: scaleDelete }], opacity: opacityDelete },
            ]}
          >
            <TouchableOpacity
              style={styles.btnAction}
              onPress={() => {
                handleActionStudent(userId, fullName, 0);
                swipeableRef.current.close();
              }}
            >
              <Ionicons name="close-outline" size={28} color={"white"} />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  };

  const handleSwipeableWillOpen = () => {
    if (
      swipeableRef.current &&
      swipeableRef.current !== openSwipeableRef.current
    ) {
      closeOpenSwipeable();
      openSwipeableRef.current = swipeableRef.current;
    }
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      onSwipeableWillOpen={handleSwipeableWillOpen}
    >
      <View style={styles.container}>
        <View style={styles.viewFullname}>
          <Text style={styles.txtFullname}>{fullName}</Text>
          {statusEnrollment === 2 && (
            <Ionicons
              name="git-pull-request-sharp"
              size={20}
              color={"#f38933dd"}
              style={{ fontWeight: "600" }}
            />
          )}
        </View>
        <View style={styles.viewExtraInfo}>
          <Text style={styles.txtStudentCode}>{studentCode}</Text>
          <Text style={styles.txtClassName}>{homeroomClass}</Text>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 6,
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  viewFullname: {
    flexDirection: "row",
    marginLeft: 24,
    flex: 9,
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  txtFullname: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  viewExtraInfo: {
    marginRight: 20,
    flex: 4,
    gap: 4,
    alignItems: "flex-end",
  },
  txtStudentCode: {
    fontSize: 13,
    color: "#555",
  },
  txtClassName: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  viewDelete: {
    backgroundColor: "#f52222",
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  iconDelete: {
    fontWeight: "600",
  },
  viewApprove: {
    backgroundColor: "#4DC591",
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  btnAction: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
});
