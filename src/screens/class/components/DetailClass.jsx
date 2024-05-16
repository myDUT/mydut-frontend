import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InfoClass from "./InfoClass";
import { useState } from "react";

export default function DetailClass() {
  const { top: paddingTop } = useSafeAreaInsets();

  const route = useRoute();
  const navigation = useNavigation();
  const [formData, setFormData] = useState(null);

  const receivedData = route.params?.data || null;

  // const initFormData = {
  //   name: receivedData["name"],
  //   classId: receivedData["classId"],
  //   room: receivedData["room"],
  //   roomId: receivedData["roomId"],
  //   classCode: receivedData["classCode"],
  //   dayOfWeek: receivedData["dayOfWeek"],
  //   dateFrom: receivedData["dateFrom"],
  //   dateTo: receivedData["dateTo"],
  //   timeFrom: receivedData["timeFrom"],
  //   timeTo: receivedData["timeTo"],
  // };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <TouchableOpacity onPress={() => navigation.navigate("ClassList")}>
        <Text>BACK</Text>
      </TouchableOpacity>
      <InfoClass
        initFormData={receivedData}
        onFormSubmit={(data) => setFormData(data)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flex: 1,
  },
});
