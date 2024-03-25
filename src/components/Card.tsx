import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  card: {
    width: 350,
    height: 500,
    borderRadius: 15,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 40,
    paddingBottom: 40,
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignContent: "space-between",
  },
  text: {
    fontFamily: "Inter-Bold",
    fontSize: 32,
    color: "white",
    textAlign: "left",
    width: "100%",
  },
  authorText: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "white",
    textAlign: "left",
  },
});

interface CardProps {
  backgroundColorStyle: string;
  text?: string;
  image?: string; // TODO: Not sure if this should be a string or some image prop
  authorText: string;
  authorImage?: string;
}

export default function Card(props: CardProps) {
  return (
    <View
      style={[{ backgroundColor: props.backgroundColorStyle }, styles.card]}
    >
      <Text style={styles.text}>{props.text}</Text>
      <Text style={styles.authorText}>{props.authorText}</Text>
    </View>
  );
}
