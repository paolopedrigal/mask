import {
  CARD_BORDER_RADIUS,
  CARD_HEIGHT,
  CARD_WIDTH,
} from "@assets/styles/card";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";

// TODO: dynamically receive 5 cards from database
export default function HandPreview() {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 30,
      }}
    >
      <Image
        style={{
          height: 100,
          width: CARD_WIDTH * 0.95,
          borderRadius: CARD_BORDER_RADIUS,
          backgroundColor: "pink",
          position: "absolute",
          top: 0,
          transform: [{ rotate: "10deg" }],
        }}
        source={require("@assets/images/test-2.jpg")}
        contentPosition={{ top: 0, right: "50%" }}
        blurRadius={25}
      />
      <Image
        style={{
          height: 100,
          width: CARD_WIDTH * 0.98,
          borderRadius: CARD_BORDER_RADIUS,
          backgroundColor: "purple",
          position: "absolute",
          top: 15,
          transform: [{ rotate: "5deg" }],
        }}
        source={require("@assets/images/test.jpg")}
        contentPosition={{ top: 0, right: "50%" }}
        blurRadius={10}
      />
      <Image
        style={{
          height: CARD_HEIGHT,
          width: CARD_WIDTH,
          borderRadius: CARD_BORDER_RADIUS,
          position: "absolute",
          top: 30,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
        blurRadius={0}
        source={require("@assets/images/test-1.jpg")}
      >
        <BlurView
          style={{
            width: "100%",
            padding: 30,
            shadowColor: "#000000",
            shadowOpacity: 1,
            shadowRadius: 30,
            elevation: 30,
          }}
          intensity={10}
          tint="systemThickMaterialDark"
        >
          <Text
            style={{
              color: "white",
              fontFamily: "Inter-Bold",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            View Hand
          </Text>
        </BlurView>
      </Image>
    </View>
  );
}
