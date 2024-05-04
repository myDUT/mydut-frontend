import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InfoClass from "./InfoClass";

export default function DetailClass() {
  const { top: paddingTop } = useSafeAreaInsets();

  const route = useRoute();
  const navigation = useNavigation();

  const receivedData = route.params?.data || null;

  const initFormData = {
    name: receivedData["name"],
    room: receivedData["room"],
    dayofweek: receivedData["day_of_week"],
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <TouchableOpacity onPress={() => navigation.navigate("ClassList")}>
        <Text>BACK</Text>
      </TouchableOpacity>
      <InfoClass initFormData={initFormData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flex: 1,
  },
});
