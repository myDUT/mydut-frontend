import { Image, StyleSheet, Text, View } from "react-native";
export default function Header() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = "";

    if (hour >= 5 && hour < 12) {
      greeting = "Good morning!";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Good afternoon!";
    } else {
      greeting = "Good evening!";
    }
    return greeting;
  };
  return (
    <View style={styles.viewHeader}>
      <Image
        source={{
          uri: "https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvcHUyMzMxNzg4LWltYWdlLXJtNTAzLTAxXzEtbDBqOXFyYzMucG5n.png",
        }}
        style={styles.imgAvt}
      />
      <View>
        <Text style={styles.txtGreeting}>{getGreeting()}</Text>
        <Text style={styles.txtName}>Welcome back, LUONG NGOC DAT</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  imgAvt: {
    height: 50,
    width: 50,
    borderRadius: 999,
  },
  viewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 14,
  },
  txtGreeting: {
    fontSize: 20,
    fontWeight: "700",
  },
  txtName: {
    fontSize: 14,
    fontWeight: "400",
  },
});
