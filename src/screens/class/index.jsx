import { View, Text, StyleSheet, SectionList } from "react-native";
import Header from "./components/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ClassCard from "./components/ClassCard";
import { getClassList } from "../../mock/data_mock";
import NewClassBtn from "./components/NewClassBtn";

export default function Class() {
  const { top: paddingTop } = useSafeAreaInsets();

  const classListByUser = getClassList();

  return (
    <View style={[styles.container, { paddingTop }]}>
      <Header />
      <SectionList
        style={styles.sessionList}
        sections={classListByUser}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item: classItem }) => {
          return <ClassCard classInfo={classItem} />;
        }}
        renderSectionHeader={({ section: { day_of_week } }) => (
          <Text style={styles.headerSessionList}>{day_of_week}</Text>
        )}
        stickySectionHeadersEnabled
      />
      <NewClassBtn />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sessionList: {
    marginTop: 16,
  },
  headerSessionList: {
    fontSize: 24,
    backgroundColor: "#FF7648",
    paddingVertical: 2,
    paddingHorizontal: 5,
    color: "#FFF",
    fontWeight: "500",
    letterSpacing: 1.3,
    marginVertical: 2,
  },
  title: {
    fontSize: 24,
  },
});
