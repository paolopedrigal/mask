import { AuthContext, AuthContextStates } from "@contexts/AuthProvider";
import { HeaderBackButton } from "@react-navigation/elements";
import { StackActions, useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import {
  SignInUpJSONType,
  SignInUpValues,
  SignInUpProps,
} from "@_types/AuthTypes";

// Get JSON data from "@assets/json/sign-in-up.json"
const signInUpJSON: SignInUpJSONType = require("@assets/json/sign-in-up.json");
const signUpQuestions: SignInUpValues = signInUpJSON["sign-up-questions"];
const signInQuestions: SignInUpValues = signInUpJSON["sign-in-questions"];
const signUpPlaceholderTexts: SignInUpValues =
  signInUpJSON["sign-up-place-holder-texts"];
const signInPlaceholderTexts: SignInUpValues =
  signInUpJSON["sign-in-place-holder-texts"];

export default function SignInUpBackButton() {
  const signInUpNavigation = useNavigation<SignInUpProps["navigation"]>();
  const {
    decrementSignInUpScreen,
    isSignUpState,
    signInUpScreen,
    setBirthday,
    setEmail,
    setIsPush,
    setName,
  }: AuthContextStates = useContext(AuthContext) as AuthContextStates;

  const navigateToPrevSignInUpScreen = () => {
    if (signInUpScreen == 1) {
      if (isSignUpState) setBirthday("");
      else setEmail("");
      signInUpNavigation.goBack();
    } else {
      setIsPush(false);

      if (isSignUpState) {
        if (signInUpScreen == 2) setName("");
        if (signInUpScreen == 3) setEmail("");
      }

      signInUpNavigation.dispatch(
        StackActions.replace("SignInUp", {
          isSignUp: isSignUpState,
          question: isSignUpState
            ? signUpQuestions[signInUpScreen - 1]
            : signInQuestions[signInUpScreen - 1],
          textInputPlaceholderText: isSignUpState
            ? signUpPlaceholderTexts[signInUpScreen - 1]
            : signInPlaceholderTexts[signInUpScreen - 1],
          textInputKeyboardType:
            isSignUpState && signInUpScreen == 2 ? "numeric" : "default",
        })
      );
      decrementSignInUpScreen();
    }
  };

  return (
    <HeaderBackButton
      labelVisible={false}
      tintColor="white"
      onPress={navigateToPrevSignInUpScreen}
    />
  );
}
