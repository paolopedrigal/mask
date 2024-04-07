import {
  AUTHOR_IMAGE_BORDER_COLOR,
  COMMENT_SHADED_COLOR,
  HIGH_LUMINANCE_TEXT_COLOR,
  LOW_LUMINANCE_TEXT_COLOR,
} from "@assets/styles/colors";
import { StyleSheet, Text, View } from "react-native";
import { CommentProps } from "@_types/CardTypes";
import { Image } from "expo-image";

const styles = StyleSheet.create({
  comment: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomWidth: 0.2,
    paddingLeft: 15,
    paddingRight: 55,
    paddingVertical: 15,
    gap: 10,
  },
  authorImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
    borderColor: AUTHOR_IMAGE_BORDER_COLOR,
    borderWidth: 0.5,
  },
  authorText: {
    color: LOW_LUMINANCE_TEXT_COLOR,
    fontFamily: "Inter-Bold",
    fontSize: 12,
  },
  commentText: {
    color: LOW_LUMINANCE_TEXT_COLOR,
    fontFamily: "Inter-Regular",
    fontSize: 12,
  },
  textColorHighLuminance: {
    color: HIGH_LUMINANCE_TEXT_COLOR,
  },
  textColorLowLuminance: {
    color: LOW_LUMINANCE_TEXT_COLOR,
  },
});

function Comment(props: CommentProps) {
  const {
    authorImage,
    authorText,
    comment,
    secondaryBackgroundColor,
    hasHighLuminance,
  }: CommentProps = props;

  return (
    <View
      style={[styles.comment, { borderBottomColor: secondaryBackgroundColor }]}
    >
      <Image source={authorImage} style={styles.authorImage} />
      <Text
        style={[
          styles.authorText,
          hasHighLuminance
            ? styles.textColorHighLuminance
            : styles.textColorLowLuminance,
        ]}
      >
        {authorText}{" "}
        <Text
          style={[
            styles.commentText,
            hasHighLuminance
              ? styles.textColorHighLuminance
              : styles.textColorLowLuminance,
          ]}
        >
          {comment}
        </Text>
      </Text>
    </View>
  );
}

Comment.defaultProps = {
  secondaryBackgroundColor: COMMENT_SHADED_COLOR,
  hasHighLuminance: false,
};

export default Comment;
