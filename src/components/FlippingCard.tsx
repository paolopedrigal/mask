import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FlippingCardProps } from "@_types/CardTypes";
import FlippingCardButton from "./FlippingCardButton";

export default function FlippingCard(props: FlippingCardProps) {
  const {
    FrontCard, // Component to render for the front side of the flipping card
    BackCard, // Componetn to render for back side of the flipping card
    width, // Width to set both `FrontCard` and `BackCard` components
  }: FlippingCardProps = props;
  const keyboardVerticalOffset = Platform.OS === "ios" ? 150 : 0;
  const rotate = useSharedValue(0);
  const frontCardAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 1], [1, 180]);
    return {
      transform: [
        {
          rotateY: withTiming(`${rotateValue}deg`, { duration: 500 }),
        },
      ],
    };
  });
  const backCardAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotate.value, [0, 1], [180, 360]);
    return {
      transform: [
        {
          rotateY: withTiming(`${rotateValue}deg`, { duration: 500 }),
        },
      ],
      // Conditionally set pointerEvents based on rotate.value
      pointerEvents: rotate.value === 0 ? "none" : "auto",
    };
  });
  const flippingCardCallback = () => {
    rotate.value = rotate.value ? 0 : 1;
    console.log(rotate.value);
  };

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Animated.View
        style={[
          frontCardAnimatedStyle,
          {
            backfaceVisibility: "hidden",
            position: "absolute",
            top: 0,
            width: width,
          },
        ]}
      >
        {FrontCard}
        <FlippingCardButton
          flippingCardCallback={flippingCardCallback}
          isFrontCard={true}
        />
      </Animated.View>
      <Animated.View
        style={[
          backCardAnimatedStyle,
          {
            backfaceVisibility: "hidden",
            position: "absolute",
            top: 0,
            width: width,
          },
        ]}
      >
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          {BackCard}
          <FlippingCardButton
            flippingCardCallback={flippingCardCallback}
            isFrontCard={false}
          />
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}
