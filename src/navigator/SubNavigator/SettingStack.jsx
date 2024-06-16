import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Setting from "../../screens/setting";

const SettingStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="SettingList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SettingList" component={Setting} />
    </Stack.Navigator>
  );
};
export default SettingStack;
