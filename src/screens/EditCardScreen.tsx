import { EditCardScreenProps } from "@_types/NavigationTypes";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import EditCard from "@components/EditCard";
import { DARK_BG_COLOR } from "@assets/styles/colors";
import { Image } from "expo-image";
import { useState } from "react";

export default function EditCardScreen({
  navigation,
  route,
}: EditCardScreenProps) {
  const { image } = route.params;
  const [cardText, setCardText] = useState<string>("");

  const keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 200;

  const allowNavigate: boolean = image != undefined || cardText != "";

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          backgroundColor: DARK_BG_COLOR,
        }}
      >
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={{ marginVertical: 5 }}
        >
          <EditCard
            cardText={cardText}
            setCardText={setCardText}
            image={image}
          />
        </KeyboardAvoidingView>
        <Pressable
          onPress={() => {
            if (allowNavigate) {
              if (cardText == "") setCardText(" ");
              navigation.push("PostCard", { image: image, cardText: cardText });
            }
          }}
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={
              allowNavigate
                ? require("@assets/icons/slide-up-icon.png")
                : require("@assets/icons/slide-up-icon-faded.png")
            }
            style={{ width: 30, height: 30 }}
          />
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}
