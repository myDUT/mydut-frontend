import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    <View style={[styles.container, { paddingTop }]}>
      <Text>Setting</Text>
      <TouchableOpacity onPress={() => onLogout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
