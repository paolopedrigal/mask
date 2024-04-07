import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CardProps } from "@_types/CardTypes";
import {
  AUTHOR_IMAGE_BORDER_COLOR,
  HIGH_LUMINANCE_TEXT_COLOR,
  LOW_LUMINANCE_TEXT_COLOR,
} from "@assets/styles/colors";
import { hasHighLuminance } from "@utils/utils";
import { CARD_BORDER_RADIUS, CARD_HEIGHT } from "@assets/styles/card";

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    borderRadius: CARD_BORDER_RADIUS,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 40,
    paddingBottom: 30,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  imageView: {
    height: CARD_HEIGHT,
  },
  cardRadius: {
    borderRadius: CARD_BORDER_RADIUS,
  },
  semiTransparentDarkTint: {
    backgroundColor: "rgba(0,0,0, 0.60)",
  },
  text: {
    color: LOW_LUMINANCE_TEXT_COLOR, // default
    fontFamily: "Inter-Bold",
    fontSize: 32,
    textAlign: "left",
    width: "100%",
  },
  iOSLowLuminanceTextBlur: {
    color: LOW_LUMINANCE_TEXT_COLOR,
    fontFamily: "Inter-Bold",
    fontSize: 32,
    left: -2000,
    elevation: 2,
    backgroundColor: "transparent",
    shadowOpacity: 1,
    shadowRadius: 7,
    shadowColor: LOW_LUMINANCE_TEXT_COLOR, // "rgba(255,255,255,1)",
    shadowOffset: { width: 2000, height: 0 },
  },
  androidLowLuminanceTextBlur: {
    color: "transparent",
    width: "105%",
    height: "85%",
    fontFamily: "Inter-Bold",
    fontSize: 32,
    textShadowRadius: 35,
    textShadowOffset: { width: 9, height: 0 },
    textShadowColor: LOW_LUMINANCE_TEXT_COLOR, // "rgba(255,255,255,1)",
  },
  iOSHighLuminanceTextBlur: {
    color: HIGH_LUMINANCE_TEXT_COLOR,
    fontFamily: "Inter-Bold",
    fontSize: 32,
    left: -2000,
    elevation: 2,
    backgroundColor: "transparent",
    shadowOpacity: 1,
    shadowRadius: 7,
    shadowColor: HIGH_LUMINANCE_TEXT_COLOR, // "rgba(255,255,255,1)",
    shadowOffset: { width: 2000, height: 0 },
  },
  androidHighLuminanceTextBlur: {
    color: "transparent",
    width: "105%",
    height: "85%",
    fontFamily: "Inter-Bold",
    fontSize: 32,
    textShadowRadius: 35,
    textShadowOffset: { width: 9, height: 0 },
    textShadowColor: HIGH_LUMINANCE_TEXT_COLOR, // "rgba(255,255,255,1)",
  },
  highLuminanceTextColor: {
    color: HIGH_LUMINANCE_TEXT_COLOR,
  },
  lowLuminanceTextColor: {
    color: LOW_LUMINANCE_TEXT_COLOR,
  },
  transparentText: {
    color: "transparent",
  },
  authorView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    height: 50,
  },
  authorImage: {
    width: 45,
    height: 45,
    borderRadius: 100,
    borderColor: AUTHOR_IMAGE_BORDER_COLOR,
    borderWidth: 1,
  },
  authorText: {
    fontSize: 16,
    color: LOW_LUMINANCE_TEXT_COLOR, // default color
    textAlign: "left",
  },
  boldInterText: {
    fontFamily: "Inter-Bold",
  },
  regularInterText: {
    fontFamily: "Inter-Regular",
  },
});

function Card(props: CardProps) {
  const {
    authorText, // text at bottom of card; Typically the creator
    backgroundColor, // dynamically determine background color of card
    width, // has default value of 100% if not specified
    text, // (Optional)
    image, // (Optional) background image of card
    isAuthorBold, // dynamically determine if authorText will be bolded
    authorImage, // for profile picture
    isHidden, // has default value of `false` if not specified
  }: CardProps = props;

  // Styling to be mixed with `styles.card`
  const cardContainerStyle = {
    backgroundColor: backgroundColor,
    width: width,
  };

  if (image)
    return (
      <ImageBackground
        style={styles.imageView} // styling view (under the hood) containing image
        imageStyle={styles.cardRadius} // styling image itself
        resizeMode="cover"
        blurRadius={isHidden ? 20 : 0}
        source={image}
      >
        <View
          style={[
            styles.card,
            text != undefined
              ? styles.semiTransparentDarkTint // add a semi-transparent dark tint
              : {},
          ]}
        >
          <Text
            style={[
              // styles.lowLuminanceTextColor,
              isHidden
                ? Platform.OS == "ios" // blurring text differs by OS
                  ? styles.iOSLowLuminanceTextBlur
                  : styles.androidLowLuminanceTextBlur
                : styles.text,
            ]}
          >
            {text}
          </Text>
          <View style={styles.authorView}>
            {props?.authorImage ? (
              <Image source={authorImage} style={styles.authorImage} />
            ) : (
              <></> // If no author image at bottom of card
            )}
            <Text
              style={[
                isAuthorBold ? styles.boldInterText : styles.regularInterText,
                styles.authorText,
              ]}
            >
              {authorText}
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  else
    return (
      <View style={[cardContainerStyle, styles.card]}>
        <Text
          style={[
            styles.text,
            isHidden
              ? Platform.OS == "ios" // blurring text differs by OS
                ? // iOS blur
                  hasHighLuminance(backgroundColor)
                  ? styles.iOSHighLuminanceTextBlur
                  : styles.iOSLowLuminanceTextBlur
                : // Android blur
                hasHighLuminance(backgroundColor)
                ? styles.androidHighLuminanceTextBlur
                : styles.androidLowLuminanceTextBlur
              : hasHighLuminance(backgroundColor)
              ? styles.highLuminanceTextColor
              : styles.lowLuminanceTextColor,
          ]}
        >
          {text}
        </Text>
        <View style={styles.authorView}>
          {props?.authorImage ? (
            <Image source={authorImage} style={styles.authorImage} />
          ) : (
            <></> // If no author image at bottom of card
          )}
          <Text
            style={[
              isAuthorBold ? styles.boldInterText : styles.regularInterText,
              styles.authorText,
              backgroundColor
                ? hasHighLuminance(backgroundColor)
                  ? styles.highLuminanceTextColor
                  : styles.lowLuminanceTextColor
                : styles.lowLuminanceTextColor,
            ]}
          >
            {authorText}
          </Text>
        </View>
      </View>
    );
}

Card.defaultProps = {
  backgroundColor: "#000000",
  width: "100%",
  text: "",
  image: undefined,
  authorImage: undefined,
  isHidden: false,
};

export default Card;
