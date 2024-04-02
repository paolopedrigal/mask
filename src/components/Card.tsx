import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CardProps } from "@_types/CardTypes";

const styles = StyleSheet.create({
  card: {
    height: 500,
    borderRadius: 15,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 40,
    paddingBottom: 30,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  image: {
    height: 500,
  },
  text: {
    fontFamily: "Inter-Bold",
    fontSize: 32,
    color: "white",
    textAlign: "left",
    width: "100%",
  },
  iOSTextBlur: {
    color: "white",
    fontFamily: "Inter-Bold",
    fontSize: 32,
    left: -2000,
    elevation: 2,
    backgroundColor: "transparent",
    shadowOpacity: 1,
    shadowRadius: 7,
    shadowColor: "rgba(255,255,255,1)",
    shadowOffset: { width: 2000, height: 0 },
  },
  androidTextBlur: {
    color: "transparent",
    width: "105%",
    height: "85%",
    fontFamily: "Inter-Bold",
    fontSize: 32,
    textShadowRadius: 35,
    textShadowOffset: { width: 9, height: 0 },
    textShadowColor: "rgba(255,255,255,1)",
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
    borderColor: "#7C7CD4",
    borderWidth: 2,
  },
  authorText: {
    fontSize: 16,
    color: "white",
    textAlign: "left",
  },
});

function Card(props: CardProps) {
  const {
    backgroundColor, // dynamically determine background color of card
    width, // has default value of 100% if not specified
    text, // (Optional)
    image, // (Optional) background image of card
    authorText,
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
        style={styles.image}
        imageStyle={{ borderRadius: 15 }}
        resizeMode="cover"
        blurRadius={isHidden ? 20 : 0}
        source={image}
      >
        <View
          style={[
            styles.card,
            text != undefined
              ? { backgroundColor: "rgba(0,0,0, 0.60)" } // add a semi-transparent dark tint
              : {},
          ]}
        >
          <Text
            style={
              isHidden
                ? Platform.OS == "ios" // blurring text differs by OS
                  ? styles.iOSTextBlur
                  : styles.androidTextBlur
                : styles.text
            }
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
                isAuthorBold
                  ? { fontFamily: "Inter-Bold" }
                  : { fontFamily: "Inter-Regular" },
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
          style={
            isHidden
              ? Platform.OS == "ios" // blurring text differs by OS
                ? styles.iOSTextBlur
                : styles.androidTextBlur
              : styles.text
          }
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
              isAuthorBold
                ? { fontFamily: "Inter-Bold" }
                : { fontFamily: "Inter-Regular" },
              styles.authorText,
            ]}
          >
            {authorText}
          </Text>
        </View>
      </View>
    );
}

Card.defaultProps = {
  width: "100%",
  isHidden: false,
};

export default Card;
