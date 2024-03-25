import { useContext, useEffect, useState } from "react";
import {
  KeyboardTypeOptions,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import MaskInput from "react-native-mask-input";
import { AuthContext, AuthContextStates } from "@contexts/AuthProvider";
import { StackActions, useNavigation } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { FIREBASE_AUTH } from "firebaseConfig";
import { UserCredential } from "firebase/auth";
import {
  MainNavigationProps,
  SignInUpProps,
  SignInUpJSONType,
  SignInUpValues,
} from "@_types/AuthTypes";

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

// Get JSON data from "@assets/json/sign-in-up.json"
const signInUpJSON: SignInUpJSONType = require("@assets/json/sign-in-up.json");
const signUpQuestions: SignInUpValues = signInUpJSON["sign-up-questions"];
const signInQuestions: SignInUpValues = signInUpJSON["sign-in-questions"];
const signUpPlaceholderTexts: SignInUpValues =
  signInUpJSON["sign-up-place-holder-texts"];
const signInPlaceholderTexts: SignInUpValues =
  signInUpJSON["sign-in-place-holder-texts"];

interface SignInUpTextInputProps {
  keyboardType: KeyboardTypeOptions;
  placeholderText?: string;
  isSignUp: boolean;
}

export default function SignInUpTextInput(props: SignInUpTextInputProps) {
  const [text, setText] = useState<string>("");
  const authNavigation = useNavigation<SignInUpProps["navigation"]>();
  const mainNavigation = useNavigation<MainNavigationProps["navigation"]>();
  const { keyboardType, placeholderText, isSignUp } = props;
  const {
    birthday,
    email,
    name,
    incrementSignInUpScreen,
    isSubmitted,
    signInUpScreen,
    setBirthday,
    setEmail,
    setIsCreateUserError,
    setIsPush,
    setIsSubmitted,
    setIsTyped,
    setName,
  }: AuthContextStates = useContext(AuthContext) as AuthContextStates;

  const navigateToNextSignInUpScreen = () => {
    if (
      (isSignUp && signInUpScreen == 4) ||
      (!isSignUp && signInUpScreen == 2)
    ) {
      mainNavigation.navigate("MainNavigation", { screen: "Home" });
    } else {
      authNavigation.dispatch(
        // Using `replace` to prevent multiple `SignInUp` components to access the same states
        StackActions.replace("SignInUp", {
          isSignUp: isSignUp,
          question: isSignUp
            ? signUpQuestions[signInUpScreen + 1]
            : signInQuestions[signInUpScreen + 1],
          textInputPlaceholderText: isSignUp
            ? signUpPlaceholderTexts[signInUpScreen + 1]
            : signInPlaceholderTexts[signInUpScreen + 1],
          textInputKeyboardType: "default",
        })
      );
      incrementSignInUpScreen();
    }
  };

  // Change default text if already filled out when navigating to previous screen
  useEffect(() => {
    if (isSignUp && signInUpScreen == 1 && birthday != "") setText(birthday);
    else if (!isSignUp && signInUpScreen == 1 && email != "") setText(email);
    else if (signInUpScreen == 2 && name != "") setText(name);
    else if (signInUpScreen == 3 && email != "") setText(email);
  }, [signInUpScreen]);

  // If Pressable (outside of this scope) is submitted, dispatch action respective to sign in/up screen page from `text`
  useEffect(() => {
    if (isSubmitted) {
      setIsPush(true);
      setIsSubmitted(false); // Reset isSubmitted back to not being presssed/submitted
      setIsTyped(false); // Prevent user from spamming "Continue" button
      if (isSignUp && signInUpScreen == 1) {
        setBirthday(text);
        navigateToNextSignInUpScreen();
      } else if (
        (signInUpScreen == 1 && !isSignUp) ||
        (signInUpScreen == 3 && isSignUp)
      ) {
        setEmail(text);
        navigateToNextSignInUpScreen();
      } else if (signInUpScreen == 2 && !isSignUp) {
        signInWithEmailAndPassword(FIREBASE_AUTH, email, text)
          .then(() => {
            navigateToNextSignInUpScreen();
          })
          .catch((error) => {
            console.log("Error code:", error.code);
            console.log("Error message:", error.message);
            setIsCreateUserError(true);
          });
      } else if (signInUpScreen == 4 && isSignUp) {
        // && !isUserCreated && !isCreateUserError) {
        createUserWithEmailAndPassword(FIREBASE_AUTH, email, text)
          .then((userCredential: UserCredential) => {
            updateProfile(userCredential.user, { displayName: name });
            navigateToNextSignInUpScreen();
          })
          .catch((error) => {
            console.log("Error code:", error.code);
            console.log("Error message:", error.message);
            setIsCreateUserError(true);
          });
      } else {
        // Should be (isSignUp && signInUpScreen == 2)
        setName(text);
        navigateToNextSignInUpScreen();
      }
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
          maxLength={signInUpScreen == 2 && isSignUp ? 35 : undefined}
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
