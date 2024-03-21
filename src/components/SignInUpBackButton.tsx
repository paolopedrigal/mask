import { AuthContext, AuthContextStates } from "@contexts/AuthProvider";
import { HeaderBackButton } from "@react-navigation/elements";
import { StackActions, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import { KeyboardTypeOptions } from "react-native";

// Route names for the stack navigator
type AuthRouteParams = {
  Menu: undefined; // No parameters signed to SignInUp route
  SignInUp: {
    isSignUp: boolean;
    question: string;
    textInputPlaceholderText: string;
    textInputKeyboardType: KeyboardTypeOptions;
  };
};

type Props = NativeStackScreenProps<AuthRouteParams, "SignInUp">; // Get props from "SignInUp" route
// Props["navigation"] and Props["route"] also yields types for `navigation` and `route` for React Navigation
// Docs: https://reactnavigation.org/docs/typescript/#type-checking-screens

type SignInUpScreenNavigationProp = Props["navigation"];

type SignInUpKeys =
  | "sign-up-questions"
  | "sign-in-questions"
  | "sign-up-place-holder-texts"
  | "sign-in-place-holder-texts";

interface signInUpValues {
  [index: string]: string;
}

type signInUpJSONType = {
  [key in SignInUpKeys]: signInUpValues;
};

// Get JSON data from "@assets/json/sign-in-up.json"
const signInUpJSON: signInUpJSONType = require("@assets/json/sign-in-up.json");
const signUpQuestions: signInUpValues = signInUpJSON["sign-up-questions"];
const signInQuestions: signInUpValues = signInUpJSON["sign-in-questions"];
const signUpPlaceholderTexts: signInUpValues =
  signInUpJSON["sign-up-place-holder-texts"];
const signInPlaceholderTexts: signInUpValues =
  signInUpJSON["sign-in-place-holder-texts"];

export default function SignInUpBackButton() {
  const navigation = useNavigation<SignInUpScreenNavigationProp>();
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
      navigation.goBack();
    } else {
      setIsPush(false);

      if (isSignUpState) {
        if (signInUpScreen == 2) setName("");
        if (signInUpScreen == 3) setEmail("");
      }

      navigation.dispatch(
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
