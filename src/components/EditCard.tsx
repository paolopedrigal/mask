import {
  CARD_BORDER_RADIUS,
  CARD_FONT_SIZE,
  CARD_HEIGHT,
  CARD_PADDING_BOTTOM,
  CARD_PADDING_HORIZONTAL,
  CARD_PADDING_TOP,
  CARD_WIDTH,
} from "@assets/styles/card";
import { selectFavColor, selectSecondaryColor } from "@redux/userSlice";
import { applyShading } from "@utils/utils";
import {
  Keyboard,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import {
  AUTHOR_IMAGE_BORDER_COLOR,
  LOW_LUMINANCE_FADED_TEXT_COLOR,
} from "@assets/styles/colors";
import { useMemo } from "react";

interface EditCardProps {
  cardText: string;
  setCardText: (text: string) => void;
  image?: string;
}

const greetings: string[] = require("@assets/json/greetings.json");

export default function EditCard(props: EditCardProps) {
  const { cardText, setCardText, image }: EditCardProps = props;
  const cardBackgroundColor = useSelector(selectFavColor);

  const greetings: string[] = useMemo(
    () => require("@assets/json/greetings.json"),
    []
  );

  const greeting: string = useMemo(
    () => greetings[Math.floor(Math.random() * (greetings.length - 1))],
    []
  );

  if (image)
    return (
      <Image
        contentFit="cover"
        source={image}
        style={{
          height: CARD_HEIGHT,
          maxHeight: CARD_HEIGHT,
          width: CARD_WIDTH,
          borderRadius: CARD_BORDER_RADIUS,
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: CARD_BORDER_RADIUS,
            paddingTop: CARD_PADDING_TOP,
            paddingHorizontal: CARD_PADDING_HORIZONTAL,
            paddingBottom: CARD_PADDING_BOTTOM,
            justifyContent: "space-between",
            alignItems: "flex-start",
            backgroundColor: "rgba(0,0,0, 0.60)",
          }}
        >
          <TextInput
            placeholder={greeting}
            placeholderTextColor={LOW_LUMINANCE_FADED_TEXT_COLOR}
            value={cardText}
            onChangeText={setCardText}
            selectionColor={"#FFFFFF"}
            autoCapitalize="none"
            multiline
            blurOnSubmit
            enterKeyHint="done"
            onKeyPress={({ nativeEvent: { key: keyValue } }) => {
              if (keyValue == " " && cardText == "") {
                console.log("setting cardText to: ", greeting);
                setCardText(greeting);
              }
              if (keyValue == "Enter") {
                Keyboard.dismiss();
              }
            }}
            style={{
              color: "#FFFFFF",
              fontSize: CARD_FONT_SIZE,
              fontFamily: "Inter-Bold",
              flex: 1,
              width: "100%",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              height: 50,
            }}
          >
            <Image
              source={require("@assets/images/default-profile-pic.png")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                borderColor: AUTHOR_IMAGE_BORDER_COLOR,
                borderWidth: 1,
              }}
            />
            <Text style={{ fontFamily: "Inter-Regular", color: "#FFFFFF" }}>
              boombampao
            </Text>
          </View>
        </View>
      </Image>
    );

  return (
    <View
      style={{
        height: CARD_HEIGHT,
        maxHeight: CARD_HEIGHT,
        width: CARD_WIDTH,
        backgroundColor: cardBackgroundColor,
        borderRadius: CARD_BORDER_RADIUS,
        paddingTop: CARD_PADDING_TOP,
        paddingHorizontal: CARD_PADDING_HORIZONTAL,
        paddingBottom: CARD_PADDING_BOTTOM,
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <TextInput
        placeholder={greeting}
        placeholderTextColor={applyShading(useSelector(selectFavColor))}
        value={cardText}
        onChangeText={setCardText}
        selectionColor={"#FFFFFF"}
        autoCapitalize="none"
        multiline
        blurOnSubmit
        enterKeyHint="done"
        onKeyPress={({ nativeEvent: { key: keyValue } }) => {
          if (keyValue == " " && cardText == "") {
            console.log("setting cardText to: ", greeting);
            setCardText(greeting);
          }
          if (keyValue == "Enter") {
            Keyboard.dismiss();
          }
        }}
        style={{
          color: "#FFFFFF",
          fontSize: CARD_FONT_SIZE,
          fontFamily: "Inter-Bold",
          flex: 1,
          width: "100%",
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          height: 50,
        }}
      >
        <Image
          source={require("@assets/images/default-profile-pic.png")}
          style={{
            width: 40,
            height: 40,
            borderRadius: 40,
            borderColor: AUTHOR_IMAGE_BORDER_COLOR,
            borderWidth: 1,
          }}
        />
        <Text style={{ fontFamily: "Inter-Regular", color: "#FFFFFF" }}>
          boombampao
        </Text>
      </View>
    </View>
  );
}
