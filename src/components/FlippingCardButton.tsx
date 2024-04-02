import { Image, ImageSourcePropType, Pressable } from "react-native";
import { HeaderBackButton } from "@react-navigation/elements";

interface FlippingCardProps {
  flippingCardCallback: () => void;
  isFrontCard: boolean;
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
}

function FlippingCardButton(props: FlippingCardProps) {
  const {
    flippingCardCallback,
    isFrontCard,
    top,
    bottom,
    right,
    left,
  }: FlippingCardProps = props;

  return (
    <Pressable onPress={flippingCardCallback}>
      {isFrontCard ? (
        <Image
          source={require("@assets/icons/comment-like-icon.png")}
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
          source={require("@assets/icons/back-arrow-icon.png")}
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
};

export default FlippingCardButton;
