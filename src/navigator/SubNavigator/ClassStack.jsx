import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Class from "../../screens/class";
import AddNewClass from "../../screens/class/components/AddNewClass";

const ClassStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="ClassList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ClassList" component={Class} />
      <Stack.Screen name="AddNewClass" component={AddNewClass} />
    </Stack.Navigator>
  );
};
export default ClassStack;
