import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function EmptyListComponent() {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        }}
        style={styles.image}
      />
      <Text style={styles.title}>Wow, you get a break today.</Text>
      <Text style={styles.subtitle}>
        Take it easy and remember to get ready for your next classes.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // backgroundColor: "#f0f8ff",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    marginTop: 15,
    borderRadius: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#666",
    marginVertical: 10,
  },
});
