import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Setting from "../../screens/setting";
import ViewImage from "../../screens/ViewImage";
import Home from "../../screens/home";

const HomeStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="ViewFacialRecognitionImage" component={ViewImage} />
    </Stack.Navigator>
  );
};
export default SettingStack;
