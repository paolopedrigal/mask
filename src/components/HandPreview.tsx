import {
  CARD_BORDER_RADIUS,
  CARD_HEIGHT,
  CARD_WIDTH,
} from "@assets/styles/card";
import { Pressable, Text, View } from "react-native";
import { Image, ImageSource } from "expo-image";

interface HandPreviewProps {
  handImages: ImageSource[];
  showHandCallback: () => void;
}

// TODO: dynamically receive 5 cards from database
export default function HandPreview(props: HandPreviewProps) {
  const { handImages, showHandCallback }: HandPreviewProps = props;

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 25,
      }}
    >
      {handImages.length >= 3 && (
        <Image
          style={{
            height: 100,
            width: CARD_WIDTH * 0.95,
            borderRadius: CARD_BORDER_RADIUS,
            position: "absolute",
            top: 0,
            transform: [{ rotate: "8deg" }],
          }}
          source={handImages[2]}
          contentPosition={{ top: 0, right: "50%" }}
          blurRadius={40} //{25}
        />
      )}
      {handImages.length >= 2 && (
        <Image
          style={{
            height: 100,
            width: CARD_WIDTH * 0.98,
            borderRadius: CARD_BORDER_RADIUS,
            position: "absolute",
            top: handImages.length >= 3 ? 10 : 0,
            transform: [{ rotate: "4deg" }],
          }}
          source={handImages[1]}
          contentPosition={{ top: 0, right: "50%" }}
          blurRadius={40} //{10}
        />
      )}
      <Pressable
        onPress={showHandCallback}
        style={{
          position: "absolute",
          top: handImages.length >= 3 ? 20 : handImages.length == 2 ? 10 : 0,
        }}
      >
        <Image
          style={{
            height: CARD_HEIGHT,
            width: CARD_WIDTH,
            borderRadius: CARD_BORDER_RADIUS,
            // position: "absolute",
            // top: handImages.length >= 3 ? 20 : handImages.length == 2 ? 10 : 0,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          blurRadius={40}
          source={handImages[0]}
        >
          <Image
            style={{
              height: CARD_HEIGHT,
              width: CARD_WIDTH,
              borderRadius: CARD_BORDER_RADIUS,
              position: "absolute",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            source={require("@assets/images/preview-card-cover.png")}
          />
          <Text
            style={{
              color: "white",
              fontFamily: "Inter-Bold",
              fontSize: 14,
              padding: 30,
              textAlign: "center",
            }}
          >
            View Hand
          </Text>
        </Image>
      </Pressable>
    </View>
  );
}
