import { useEffect, useState } from "react";
import {
  KeyboardTypeOptions,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import MaskInput from "react-native-mask-input";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsSubmit,
  setBirthday,
  setEmail,
  setName,
  setTyped,
} from "@redux/authSlice";

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: "row",
    width: "90%",
  },
  textInput: {
    fontFamily: "Inter-Bold",
    fontSize: 32,
    color: "white",
    width: "100%",
    height: 50,
    textAlign: "center",
  },
});

interface SignInUpTextInputProps {
  keyboardType: KeyboardTypeOptions;
  placeholderText?: string;
  signInUpScreen: number;
}

export default function SignInUpTextInput(props: SignInUpTextInputProps) {
  const [text, setText] = useState<string>("");
  const isSubmit: boolean = useSelector(selectIsSubmit);
  const dispatch = useDispatch();

  // If Pressable (outside of this scope) is pressed, dispatch action respective to sign in/up screen page from `text`
  useEffect(() => {
    if (isSubmit) {
      if (props.signInUpScreen == 1) dispatch(setEmail(text));
      else if (props.signInUpScreen == 3) dispatch(setName(text));
      else if (props.signInUpScreen == 4) dispatch(setBirthday(text));
    }
  });

  // Detects if user start typing
  useEffect(() => {
    if (text != "") dispatch(setTyped(true));
    else dispatch(setTyped(false));
  }, [text]);

  if (props.keyboardType == "numeric") {
    return (
      <MaskInput
        placeholder={props.placeholderText}
        value={text}
        onChangeText={(masked, unmasked) => setText(unmasked)}
        mask={[/\d/, /\d/, " ", /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/]}
        keyboardType={props.keyboardType}
        placeholderTextColor="#24245E"
        selectionColor={"#6767D9"}
        style={styles.textInput}
      />
    );
  } else {
    return (
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollView}
        showsHorizontalScrollIndicator={false}
      >
        <TextInput
          placeholder={props.placeholderText}
          value={text}
          onChangeText={setText}
          keyboardType={props.keyboardType}
          autoCapitalize="none"
          placeholderTextColor="#24245E"
          selectionColor={"#6767D9"}
          numberOfLines={1} // Ensure only one line is visible
          style={[
            styles.textInput,
            text.length > 15 ? { fontSize: 24 } : { fontSize: 32 }, // Change fontSize to 24 if text input is too long (i.e. longer than 15 characters)
          ]}
        />
      </ScrollView>
    );
  }
}
