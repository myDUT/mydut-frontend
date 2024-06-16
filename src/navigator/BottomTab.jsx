import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/home";
import Ionicons from "@expo/vector-icons/Ionicons";
import Class from "../screens/class";
import Notification from "../screens/notification";
import Setting from "../screens/setting";
import ClassStack from "./SubNavigator/ClassStack";
import SettingStack from "./SubNavigator/SettingStack";

export default function BottomTab() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          }
          if (route.name === "Class") {
            iconName = focused ? "book" : "book-outline";
          }
          if (route.name === "Notification") {
            iconName = focused ? "notifications" : "notifications-outline";
          }
          if (route.name === "Setting") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Ionicons name={iconName} size={28} color={color} />;
        },
      })}
    >
      <Tab.Screen name={"Home"} component={Home} />
      <Tab.Screen name={"Class"} component={ClassStack} />
      <Tab.Screen name={"Notification"} component={Notification} />
      <Tab.Screen name={"Setting"} component={SettingStack} />
    </Tab.Navigator>
  );
}
