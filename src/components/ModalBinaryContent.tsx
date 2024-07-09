import {
  HIGH_PRIORITY_TEXT_COLOR,
  INNER_VIEW_DARK_BG_COLOR,
  LOW_PRIORITY_TEXT_COLOR,
} from "@assets/styles/colors";
import { Pressable, Text, View } from "react-native";

interface ModalContentProps {
  title: string;
  leftText: string;
  rightText: string;
  leftCallback: () => void;
  rightCallback: () => void;
}

export default function ModalBinaryContent(props: ModalContentProps) {
  const {
    title,
    leftText,
    rightText,
    leftCallback,
    rightCallback,
  }: ModalContentProps = props;

  return (
    <View
      style={{
        backgroundColor: INNER_VIEW_DARK_BG_COLOR,
        borderRadius: 5,
        width: 250,
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontFamily: "Inter-Bold",
          fontSize: 16,
          textAlign: "center",
          paddingVertical: 25,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 25,
        }}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={leftCallback}
        >
          <Text
            style={{
              color: LOW_PRIORITY_TEXT_COLOR,
              fontSize: 14,
              fontFamily: "Inter-Regular",
            }}
          >
            {leftText}
          </Text>
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={rightCallback}
        >
          <Text
            style={{
              color: HIGH_PRIORITY_TEXT_COLOR,
              fontSize: 14,
              fontFamily: "Inter-Regular",
            }}
          >
            {rightText}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
