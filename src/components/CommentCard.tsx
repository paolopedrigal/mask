import Comment from "@components/Comment";
import { CARD_BORDER_RADIUS, CARD_HEIGHT, CARD_WIDTH } from "@theme/card";
import {
  COMMENT_SHADED_COLOR,
  HIGH_LUMINANCE_TEXT_COLOR,
  HIGH_LUMINCANCE_FADED_TEXT_COLOR,
  LOW_LUMINANCE_FADED_TEXT_COLOR,
  LOW_LUMINANCE_TEXT_COLOR,
} from "@theme/colors";
import { CommentCardProps } from "@ts/interfaces/card";
import { applyShading, hasHighLuminance } from "@utils/styling";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

function CommentCard(props: CommentCardProps) {
  const [commentText, setCommentText] = useState<string>("");
  const { backgroundColor, comments }: CommentCardProps = props;

  const secondaryBackgroundColor: string | undefined =
    applyShading(backgroundColor);

  return (
    <View
      style={[
        styles.commentCard,
        {
          backgroundColor: backgroundColor,
        },
      ]}
    >
      <View style={styles.commentSectionView}>
        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <Comment
              authorImage={item.authorImage}
              authorText={item.authorText}
              comment={item.comment}
              secondaryBackgroundColor={
                backgroundColor ? secondaryBackgroundColor : backgroundColor
              }
              hasHighLuminance={
                backgroundColor ? hasHighLuminance(backgroundColor) : false
              }
            />
          )}
          ListEmptyComponent={
            <Text
              style={[
                styles.emptyCommentSectionText,
                backgroundColor
                  ? hasHighLuminance(backgroundColor)
                    ? { color: HIGH_LUMINANCE_TEXT_COLOR }
                    : { color: LOW_LUMINANCE_TEXT_COLOR }
                  : { color: LOW_LUMINANCE_TEXT_COLOR },
              ]}
            >
              Nothing to see here yet!
            </Text>
          }
        />
      </View>
      <TextInput
        placeholder={"Post a comment..."}
        value={commentText}
        onChangeText={setCommentText}
        placeholderTextColor={
          backgroundColor
            ? hasHighLuminance(backgroundColor)
              ? HIGH_LUMINCANCE_FADED_TEXT_COLOR
              : LOW_LUMINANCE_FADED_TEXT_COLOR
            : LOW_LUMINANCE_FADED_TEXT_COLOR
        }
        style={[
          styles.commentTextInput,
          {
            backgroundColor: backgroundColor
              ? secondaryBackgroundColor
              : backgroundColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  commentCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_BORDER_RADIUS,
    paddingTop: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  commentSectionView: {
    justifyContent: "center",
    // alignItems: "stretch",
    height: 375,
    marginVertical: 20,
    width: "100%",
  },
  emptyCommentSectionText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    textAlign: "center",
  },
  commentTextInput: {
    borderRadius: 25,
    width: 275,
    height: 30,
    paddingLeft: 10,
    color: "white",
  },
});

CommentCard.defaultProps = {
  backgroundColor: "#000000",
  secondaryBackgroundColor: COMMENT_SHADED_COLOR,
};

export default CommentCard;
