import { useContext, useEffect, useState } from "react";
import {
  KeyboardTypeOptions,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import MaskInput from "react-native-mask-input";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { AuthContext, AuthContextStates } from "@contexts/AuthProvider";
import SignInUpScreen from "@screens/SignInUpScreen";

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
  const { keyboardType, placeholderText, signInUpScreen } = props;
  const {
    email,
    isSubmitted,
    setIsCreateUserError,
    setEmail,
    setIsSubmitted,
    setIsTyped,
    setIsSignedUp,
    isSignedUp,
    isCreateUserError,
  }: AuthContextStates = useContext(AuthContext) as AuthContextStates;

  // If Pressable (outside of this scope) is submitted, dispatch action respective to sign in/up screen page from `text`
  useEffect(() => {
    console.log("Detects changes in isSubmitted:", isSubmitted);

    if (isSubmitted && text != "") {
      if (signInUpScreen == 1) setEmail(text);
      else if (signInUpScreen == 2 && !isSignedUp && !isCreateUserError) {
        createUserWithEmailAndPassword(FIREBASE_AUTH, email, text)
          .then(() => {
            console.log("Create user");
            setIsSignedUp(false);
          })
          .catch((error) => {
            console.log("Error code:", error.code);
            console.log("Error message:", error.message);
            setIsCreateUserError(true);
          });
      }
      setIsSubmitted(false); // Update `isSubmitted` state within AuthContext
    }
  }, [isSubmitted]);

  // Detects if user start typing
  useEffect(() => {
    if (text != "") setIsTyped(true);
    else setIsTyped(false);
  }, [text]);

  if (props.keyboardType == "numeric") {
    return (
      <MaskInput
        placeholder={placeholderText}
        value={text}
        onChangeText={(masked, unmasked) => setText(unmasked)}
        mask={[/\d/, /\d/, " ", /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/]}
        keyboardType={keyboardType}
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
          placeholder={placeholderText}
          value={text}
          onChangeText={setText}
          keyboardType={keyboardType}
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
