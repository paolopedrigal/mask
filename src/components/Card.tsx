import {
  DimensionValue,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image, ImageSource } from "expo-image";
import { CardProps } from "@_types/CardTypes";
import {
  AUTHOR_IMAGE_BORDER_COLOR,
  HIGH_LUMINANCE_TEXT_COLOR,
  LOW_LUMINANCE_TEXT_COLOR,
} from "@assets/styles/colors";
import { hasHighLuminance } from "@utils/utils";
import {
  CARD_AUTHOR_FONT_SIZE,
  CARD_BORDER_RADIUS,
  CARD_FONT_SIZE,
  CARD_HEIGHT,
  CARD_PADDING_BOTTOM,
  CARD_PADDING_HORIZONTAL,
  CARD_PADDING_TOP,
  CARD_WIDTH,
} from "@assets/styles/card";
import { useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { HomeProps } from "@_types/NavigationTypes";
import { supabase } from "supabase";

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_BORDER_RADIUS,
    paddingHorizontal: CARD_PADDING_HORIZONTAL,
    paddingTop: CARD_PADDING_TOP,
    paddingBottom: CARD_PADDING_BOTTOM,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  imageView: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_BORDER_RADIUS,
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: "absolute", // Absolute positioning for the image
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: CARD_BORDER_RADIUS,
  },
  semiTransparentDarkTintView: {
    flex: 1,
    paddingHorizontal: CARD_PADDING_HORIZONTAL,
    paddingTop: CARD_PADDING_TOP,
    paddingBottom: CARD_PADDING_BOTTOM,
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "rgba(0,0,0, 0.60)",
  },
  text: {
    color: LOW_LUMINANCE_TEXT_COLOR, // default
    fontFamily: "Inter-Bold",
    fontSize: CARD_AUTHOR_FONT_SIZE,
    textAlign: "left",
    width: "100%",
  },
  iOSLowLuminanceTextBlur: {
    color: LOW_LUMINANCE_TEXT_COLOR,
    fontFamily: "Inter-Bold",
    fontSize: CARD_AUTHOR_FONT_SIZE,
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
    fontSize: CARD_FONT_SIZE,
    textShadowRadius: CARD_AUTHOR_FONT_SIZE + 3,
    textShadowOffset: { width: 9, height: 0 },
    textShadowColor: LOW_LUMINANCE_TEXT_COLOR, // "rgba(255,255,255,1)",
  },
  iOSHighLuminanceTextBlur: {
    color: HIGH_LUMINANCE_TEXT_COLOR,
    fontFamily: "Inter-Bold",
    fontSize: CARD_AUTHOR_FONT_SIZE,
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
    fontSize: CARD_FONT_SIZE,
    textShadowRadius: CARD_AUTHOR_FONT_SIZE + 3,
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
    gap: 10,
    height: 50,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderColor: AUTHOR_IMAGE_BORDER_COLOR,
    borderWidth: 1,
  },
  authorText: {
    fontSize: CARD_AUTHOR_FONT_SIZE,
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
    authorID, // id of author
    authorText, // text at bottom of card; Typically the creator
    backgroundColor, // dynamically determine background color of card
    width, // has default value of 350 (CARD_WIDTH)
    height, // has default value of 500 (CARD_HEIGHT)
    text, // (Optional)
    fontSize, // has default value of 32
    image, // (Optional) background image of card
    isAuthorBold, // dynamically determine if authorText will be bolded
    hasAuthorImage, // determines if card has profile picture
    authorFontSize, // has default value of 16
    isHidden, // has default value of `false` if not specified
    scalar, // Scaling factor of shrinking or enlargening card. Default value of 1
    paddingTop, // has default value of 40
    paddingBottom, // has default value of 30
    paddingHorizontal, // has default value of 25
  }: CardProps = props;

  const viewProfileNavigation = useNavigation<HomeProps["navigation"]>(); // TODO: make this a prop?
  const [profilePic, setProfilePic] = useState<ImageSource>();

  ////////////////////////////////////////////////////////////////////////////////////////

  // Memoizes styling props for Card
  // Each styling prop returns their respective input prop/default prop * scalingFactor
  // Else returns default prop

  const scalingFactor: number = useMemo(() => {
    return scalar ? scalar : 1;
  }, [scalar]);

  const widthNumber: DimensionValue = useMemo(() => {
    return width && typeof width === "number"
      ? width * scalingFactor
      : CARD_WIDTH;
  }, [width, scalingFactor]);

  const heightNumber: DimensionValue = useMemo(() => {
    return height && typeof height === "number"
      ? height * scalingFactor
      : CARD_HEIGHT;
  }, [height, scalingFactor]);

  const fontSizeNumber: number = useMemo(() => {
    return fontSize ? fontSize * scalingFactor : CARD_FONT_SIZE;
  }, [fontSize, scalingFactor]);

  const authorFontSizeNumber: number = useMemo(() => {
    return authorFontSize
      ? authorFontSize * scalingFactor
      : CARD_AUTHOR_FONT_SIZE;
  }, [authorFontSize, scalingFactor]);

  const paddingTopNumber: number = useMemo(() => {
    return paddingTop ? paddingTop * scalingFactor : CARD_PADDING_TOP;
  }, [paddingTop, scalingFactor]);

  const paddingBottomNumber: number = useMemo(() => {
    return paddingBottom ? paddingBottom * scalingFactor : CARD_PADDING_BOTTOM;
  }, [paddingBottom, scalingFactor]);

  const paddingHorizontalNumber: number = useMemo(() => {
    return paddingHorizontal
      ? paddingHorizontal * scalingFactor
      : CARD_PADDING_HORIZONTAL;
  }, [paddingHorizontal, scalingFactor]);

  ////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const fetchProfilePicFromStorage = async (): Promise<
      string | ArrayBuffer | null
    > => {
      try {
        const { data, error } = await supabase.storage
          .from("profile_pics")
          .download(authorID + "/profile.jpg");
        if (error) throw error;
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(data);
          fileReader.onloadend = () => {
            resolve(fileReader.result);
          };
          fileReader.onerror = (err) => {
            reject(err);
          };
        });
      } catch (error: any) {
        const defaultProfilePic: ImageSource = require("@assets/images/default-profile-pic.png");
        setProfilePic(defaultProfilePic);
        return null;
      }
    };
    fetchProfilePicFromStorage().then((profilePic) => {
      if (profilePic != null) setProfilePic(profilePic as ImageSource);
    });
  }, []);

  if (image)
    return (
      <View
        style={[styles.imageView, { width: widthNumber, height: heightNumber }]}
      >
        <Image
          contentFit="cover"
          style={[styles.image, { width: widthNumber, height: heightNumber }]}
          blurRadius={isHidden ? 90 : 0}
          source={image}
        >
          <View
            style={[
              styles.semiTransparentDarkTintView,
              {
                paddingHorizontal: paddingHorizontalNumber,
                paddingTop: paddingTopNumber,
                paddingBottom: paddingBottomNumber,
              },
            ]}
          >
            <Text
              style={[
                isHidden
                  ? Platform.OS == "ios" // blurring text differs by OS
                    ? styles.iOSLowLuminanceTextBlur
                    : styles.androidLowLuminanceTextBlur
                  : styles.text,
                { fontSize: fontSizeNumber },
              ]}
            >
              {text}
            </Text>
            <Pressable
              onPress={() => {
                viewProfileNavigation.navigate("ViewProfile", {
                  userID: authorID,
                });
              }}
            >
              <View style={styles.authorView}>
                {profilePic != undefined && hasAuthorImage ? (
                  <Image source={profilePic} style={styles.authorImage} />
                ) : (
                  <></> // If no author image at bottom of card
                )}
                <Text
                  style={[
                    isAuthorBold
                      ? styles.boldInterText
                      : styles.regularInterText,
                    styles.authorText,
                    { fontSize: authorFontSizeNumber },
                  ]}
                >
                  {authorText}
                </Text>
              </View>
            </Pressable>
          </View>
        </Image>
      </View>
    );
  else
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: backgroundColor,
            width: widthNumber,
            height: heightNumber,
            paddingHorizontal: paddingHorizontalNumber,
            paddingTop: paddingTopNumber,
            paddingBottom: paddingBottomNumber,
          },
        ]}
      >
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
            { fontSize: fontSizeNumber },
          ]}
        >
          {text}
        </Text>
        <Pressable
          onPress={() => {
            viewProfileNavigation.navigate("ViewProfile", {
              userID: authorID,
            });
          }}
        >
          <View style={styles.authorView}>
            {profilePic != undefined && hasAuthorImage ? (
              <Image source={profilePic} style={styles.authorImage} />
            ) : (
              <></> // If no author image at bottom of card
            )}
            <Text
              style={[
                isAuthorBold ? styles.boldInterText : styles.regularInterText,
                styles.authorText,
                { fontSize: authorFontSizeNumber },
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
        </Pressable>
      </View>
    );
}

Card.defaultProps = {
  authorID: "",
  backgroundColor: "#000000",
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  text: "",
  fontSize: CARD_FONT_SIZE,
  image: undefined,
  authorImage: undefined,
  authorFontSize: CARD_AUTHOR_FONT_SIZE,
  paddingHorizontal: CARD_PADDING_HORIZONTAL,
  paddingTop: CARD_PADDING_TOP,
  paddingBottom: CARD_PADDING_BOTTOM,
  isHidden: false,
  scalar: 1,
};

export default Card;
