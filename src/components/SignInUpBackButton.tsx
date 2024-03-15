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

type Props = NativeStackScreenProps<AuthRouteParams, "SignInUp">; // Get props from "SignIn" route (i.e. undefined in this case)
// Props["navigation"] and Props["route"] also yields types for `navigation` and `route` for React Navigation
// Docs: https://reactnavigation.org/docs/typescript/#type-checking-screens

type SignInUpScreenNavigationProp = Props["navigation"];

type SignInUpKeys =
  | "sign-up-questions"
  | "sign-in-questions"
  | "place-holder-texts";

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
const placeholderTexts: signInUpValues = signInUpJSON["place-holder-texts"];

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
      setEmail("");
      navigation.goBack();
    } else {
      setIsPush(false);

      if (signInUpScreen == 3) setName("");
      else if (signInUpScreen == 4) setBirthday("");

      navigation.dispatch(
        StackActions.replace("SignInUp", {
          isSignUp: isSignUpState,
          question: isSignUpState
            ? signUpQuestions[signInUpScreen - 1]
            : signInQuestions[signInUpScreen - 1],
          textInputPlaceholderText: placeholderTexts[signInUpScreen - 1],
          textInputKeyboardType: "default",
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
