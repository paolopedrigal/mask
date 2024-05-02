import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FlippingCardProps } from "@_types/CardTypes";
import FlippingCardButton from "./FlippingCardButton";
import { hasHighLuminance } from "@utils/utils";
import { CARD_HEIGHT, CARD_WIDTH } from "@assets/styles/card";

const styles = StyleSheet.create({
  flippingCard: {
    justifyContent: "center",
    alignItems: "center",
  },
  animatedView: {
    backfaceVisibility: "hidden",
    position: "absolute",
    top: 0,
  },
});

function FlippingCard(props: FlippingCardProps) {
  const {
    frontCard, // Component to render for the front side of the flipping card
    backCard, // Componetn to render for back side of the flipping card
    frontCardProps, // Props to be passed to FrontCard component
    backCardProps, // Props to be passed to BackCard component
    width, // Width to set both `FrontCard` and `BackCard` components
    height, // Height to set both `FrontCard` and `BackCard` components
    backgroundColor, // Color of card
  }: FlippingCardProps = props;

  const keyboardVerticalOffset = Platform.OS === "ios" ? 150 : 200;

  // Animation logic for flipping card
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
  };

  return (
    <View style={styles.flippingCard}>
      <Animated.View
        style={[
          frontCardAnimatedStyle,
          styles.animatedView,
          {
            width: width,
            height: height,
          },
        ]}
      >
        {frontCard({
          ...frontCardProps,
          backgroundColor: backgroundColor,
          width: width,
          height: height,
        })}
        <FlippingCardButton
          flippingCardCallback={flippingCardCallback}
          isFrontCard={true}
          hasHighLuminance={
            frontCardProps.image
              ? false
              : backgroundColor
              ? hasHighLuminance(backgroundColor)
              : false
          }
        />
      </Animated.View>
      <Animated.View
        style={[
          backCardAnimatedStyle,
          styles.animatedView,
          {
            width: width,
            height: height,
          },
        ]}
      >
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          {backCard({
            ...backCardProps,
            backgroundColor: backgroundColor,
          })}
          <FlippingCardButton
            flippingCardCallback={flippingCardCallback}
            isFrontCard={false}
            hasHighLuminance={
              backgroundColor ? hasHighLuminance(backgroundColor) : false
            }
          />
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

FlippingCard.defaultProps = {
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  backgroundColor: "#000000",
};

export default FlippingCard;
