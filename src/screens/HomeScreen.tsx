import { FlatList, StyleSheet, Text, View } from "react-native";
import Card from "@components/Card";
import { DrawerItem } from "@react-navigation/drawer";

const styles = StyleSheet.create({
  home: {
    backgroundColor: "#0C0B44",
  },
});

const data = [
  {
    id: "1",
    backgroundColorStyle: "#7A7ACA",
    text: "Who was the celebrity you've been the closest to?",
    authorText: "Question of the Day",
  },
  {
    id: "2",
    backgroundColorStyle: "#2A2A6B",
    text: "Bruno Mars in Las Vegas!",
    authorText: "maikaroni",
  },
  {
    id: "3",
    backgroundColorStyle: "#24245E",
    text: "Pitbull at work",
    authorText: "johnmiranda",
  },
  {
    id: "4",
    backgroundColorStyle: "#131254",
    text: "Jeremy Lin",
    authorText: "buansanity",
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.home}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Card
            backgroundColorStyle={item.backgroundColorStyle}
            text={item.text}
            authorText={item.authorText}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
