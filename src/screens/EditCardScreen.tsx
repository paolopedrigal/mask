import { EditCardScreenProps } from "@_types/NavigationTypes";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import EditCard from "@components/EditCard";
import { DARK_BG_COLOR } from "@assets/styles/colors";

export default function EditCardScreen({
  navigation,
  route,
}: EditCardScreenProps) {
  const { image } = route.params;

  const keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 200;

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
        >
          <EditCard image={image} />
        </KeyboardAvoidingView>
        <Pressable
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 42,
            width: 100,
            borderRadius: 25,
            backgroundColor: "#323232",
          }}
          onPress={() => navigation.push("PostCard")}
        >
          <Text>Next</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}
