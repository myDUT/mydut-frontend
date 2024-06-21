import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Setting from "../../screens/setting";
import ViewImage from "../../screens/ViewImage";

const SettingStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="SettingList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SettingList" component={Setting} />
      <Stack.Screen name="ViewImage" component={ViewImage} />
    </Stack.Navigator>
  );
};
export default SettingStack;
