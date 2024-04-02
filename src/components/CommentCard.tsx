import {
  FlatList,
  Image,
  ImageSourcePropType,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Comment from "@components/Comment";
import { useState } from "react";

interface Comment {
  authorImage: ImageSourcePropType;
  authorText: string;
  comment: string;
}

const comments: Comment[] = [
  {
    authorImage: require("@assets/images/test-pfp.jpg"),
    authorText: "boombampao",
    comment:
      "Wow! This is a really long comment about Bruno Mars in Las Vegas, Nevada during July of 2023! Wow!",
  },
  {
    authorImage: require("@assets/images/test-pfp.jpg"),
    authorText: "maikaroni",
    comment: "Did they take away your phones? :-(",
  },
  {
    authorImage: require("@assets/images/test-pfp.jpg"),
    authorText: "banditgawd",
    comment:
      "Bro, Logs for your project will appear below. Press Ctrl+C to exit. Logs for your project will appear below. Press Ctrl+C to exit. Logs for your project will appear below. Press Ctrl+C to exit. Logs for your project will appear below. Press Ctrl+C to exit.",
  },
  {
    authorImage: require("@assets/images/test-pfp.jpg"),
    authorText: "banditgawd",
    comment:
      "Bro, Logs for your project will appear below. Press Ctrl+C to exit. Logs for your project will appear below. Press Ctrl+C to exit. Logs for your project will appear below. Press Ctrl+C to exit. Logs for your project will appear below. Press Ctrl+C to exit.",
  },
  {
    authorImage: require("@assets/images/test-pfp.jpg"),
    authorText: "banditgawd",
    comment:
      "Bro, Logs for your project will appear below. Press Ctrl+C to exit. Logs for your project will appear below. Press Ctrl+C to exit. Logs for your project will appear below. Press Ctrl+C to exit. Logs for your project will appear below. Press Ctrl+C to exit.",
  },
  {
    authorImage: require("@assets/images/test-pfp.jpg"),
    authorText: "banditgawd",
    comment:
      "Bro, Logs for your project will appear below. Press Ctrl+C to exit. Logs for your project will appear below. Press Ctrl+C to exit. Logs for your project will appear below. Press Ctrl+C to exit. Logs for your project will appear below. Press Ctrl+C to exit.",
  },
];

export default function CommentCard() {
  const [commentText, setCommentText] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);

  return (
    <View
      style={{
        height: 500,
        borderRadius: 15,
        paddingTop: 25,
        backgroundColor: "#2A2A6B",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ height: 375, marginVertical: 20 }}>
        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <Comment
              authorImage={item.authorImage}
              authorText={item.authorText}
              comment={item.comment}
            />
          )}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <TextInput
          placeholder={"Post a comment..."}
          value={commentText}
          onChangeText={setCommentText}
          placeholderTextColor="#636363"
          style={{
            backgroundColor: "#24245E",
            borderRadius: 25,
            width: 275,
            height: 30,
            paddingLeft: 10,
            color: "white",
          }}
        />
        <Pressable
          onPress={() =>
            setIsLiked((prev) => {
              console.log(prev);
              return !prev;
            })
          }
        >
          <Image
            source={
              isLiked
                ? require("@assets/icons/like-button-icon-filled.png")
                : require("@assets/icons/like-button-icon.png")
            }
            style={{ width: 20, height: 20 }}
          />
        </Pressable>
      </View>
    </View>
  );
}
