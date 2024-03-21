import { useContext, useEffect, useState } from "react";
import {
  KeyboardTypeOptions,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import MaskInput from "react-native-mask-input";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthContext, AuthContextStates } from "@contexts/AuthProvider";
import {
  NavigatorScreenParams,
  StackActions,
  useNavigation,
} from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { UserCredential } from "firebase/auth";

// Route names for the AuthNavigation stack navigator
type AuthRouteParams = {
  Menu: undefined; // No parameters signed to SignInUp route
  SignInUp: {
    isSignUp: boolean;
    question: string;
    textInputPlaceholderText: string;
    textInputKeyboardType: KeyboardTypeOptions;
  };
};

// Route params for bottom tab navigator
type MainRouteParams = {
  Home: undefined;
  ProfileNavigation: undefined;
};

// Route names for Parent Native Stack Navigator
type AppRouteParams = {
  AuthenticationNavigation: undefined;
  MainNavigation: NavigatorScreenParams<MainRouteParams>;
};

type AppProps = NativeStackScreenProps<AppRouteParams, "MainNavigation">; // Get props from "MainNavigation" route from parent native stack navigator
// Props["navigation"] and Props["route"] also yields types for `navigation` and `route` for React Navigation
// Docs: https://reactnavigation.org/docs/typescript/#type-checking-screens

type AuthProps = NativeStackScreenProps<AuthRouteParams, "SignInUp">; // Get props from "SignInUp" route
// Props["navigation"] and Props["route"] also yields types for `navigation` and `route` for React Navigation
// Docs: https://reactnavigation.org/docs/typescript/#type-checking-screens

type SignInUpScreenNavigationProp = AuthProps["navigation"];
type AppNavigationProp = AppProps["navigation"];

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

interface SignInUpTextInputProps {
  keyboardType: KeyboardTypeOptions;
  placeholderText?: string;
  isSignUp: boolean;
}

export default function SignInUpTextInput(props: SignInUpTextInputProps) {
  const [text, setText] = useState<string>("");
  const authNavigation = useNavigation<SignInUpScreenNavigationProp>();
  const appNavigation = useNavigation<AppNavigationProp>();
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
      appNavigation.navigate("MainNavigation", { screen: "Home" });
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
