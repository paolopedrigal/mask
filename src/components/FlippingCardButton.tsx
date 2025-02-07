import { FlippingCardButtonProps } from "@ts/interfaces/card";
import { Image } from "expo-image";
import { Pressable } from "react-native";

function FlippingCardButton(props: FlippingCardButtonProps) {
  const {
    flippingCardCallback,
    isFrontCard,
    top,
    bottom,
    right,
    left,
    hasHighLuminance,
  }: FlippingCardButtonProps = props;

  return (
    <Pressable onPress={flippingCardCallback}>
      {isFrontCard ? (
        <Image
          source={
            hasHighLuminance
              ? require("@assets/icons/high-luminance-comment-like-icon.png")
              : require("@assets/icons/comment-like-icon.png")
          }
          style={{
            width: 23,
            height: 14,
            position: "absolute",
            bottom: bottom,
            right: right,
          }}
        />
      ) : (
        <Image
          source={
            hasHighLuminance
              ? require("@assets/icons/high-luminance-back-arrow-icon.png")
              : require("@assets/icons/back-arrow-icon.png")
          }
          style={{
            width: 30,
            height: 30,
            position: "absolute",
            top: top,
            left: left,
          }}
        />
      )}
    </Pressable>
  );
}

FlippingCardButton.defaultProps = {
  top: -480,
  left: 25,
  bottom: 45,
  right: 50,
  hasHighLuminance: false,
};

export default FlippingCardButton;
