import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Navigator from "./src/navigator";
import Toast, {
  BaseToast,
  ErrorToast,
  SuccessToast,
} from "react-native-toast-message";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    // <SafeAreaProvider>
    //   <SafeAreaView style={styles.container}>
    //     <Navigator />
    //     <Toast config={toastConfig} />
    //   </SafeAreaView>
    // </SafeAreaProvider>
    <>
      <Navigator />
      <Toast config={toastConfig} />
    </>
  );
}

/*
  1. Create the config
*/
const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <SuccessToast
      {...props}
      // style={{ borderLeftColor: "pink" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
      }}
      text2Style={{
        fontSize: 12,
      }}
      text1NumberOfLines={2}
      text2NumberOfLines={2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      // style={{ borderLeftColor: "pink" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
      }}
      text2Style={{
        fontSize: 12,
      }}
      text1NumberOfLines={2}
      text2NumberOfLines={2}
    />
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
