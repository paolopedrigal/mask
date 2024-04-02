import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

const styles = StyleSheet.create({
  comment: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#24245E",
    paddingLeft: 15,
    paddingRight: 55,
    paddingVertical: 15,
    gap: 10,
  },
  authorImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
    borderColor: "#7C7CD4",
    borderWidth: 1.5,
  },
  authorText: {
    color: "white",
    fontFamily: "Inter-Bold",
    fontSize: 12,
  },
  commentText: {
    color: "white",
    fontFamily: "Inter-Regular",
    fontSize: 12,
  },
});

interface CommentProps {
  authorImage: ImageSourcePropType;
  authorText: string;
  comment: string;
}

export default function Comment(props: CommentProps) {
  const { authorImage, authorText, comment }: CommentProps = props;

  return (
    <View style={styles.comment}>
      <Image source={authorImage} style={styles.authorImage} />
      <Text style={styles.authorText}>
        {authorText} <Text style={styles.commentText}>{comment}</Text>
      </Text>
    </View>
  );
}
