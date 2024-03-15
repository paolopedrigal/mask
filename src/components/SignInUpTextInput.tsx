import { useContext, useEffect, useState } from "react";
import {
  KeyboardTypeOptions,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import MaskInput from "react-native-mask-input";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { FIREBASE_AUTH } from "../../firebaseConfig";
import { AuthContext, AuthContextStates } from "@contexts/AuthProvider";
import { StackActions, useNavigation } from "@react-navigation/native";

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

interface SignInUpTextInputProps {
  keyboardType: KeyboardTypeOptions;
  placeholderText?: string;
  isSignUp: boolean;
}

export default function SignInUpTextInput(props: SignInUpTextInputProps) {
  const [text, setText] = useState<string>("");
  const navigation = useNavigation<SignInUpScreenNavigationProp>();
  const { keyboardType, placeholderText, isSignUp } = props;
  const {
    email,
    name,
    incrementSignInUpScreen,
    isCreateUserError,
    isSubmitted,
    isUserCreated,
    signInUpScreen,
    setBirthday,
    setEmail,
    setIsCreateUserError,
    setIsPush,
    setIsSubmitted,
    setIsTyped,
    setIsUserCreated,
    setName,
  }: AuthContextStates = useContext(AuthContext) as AuthContextStates;

  const navigateToNextSignInUpScreen = () => {
    console.log("Navigating... from screen", signInUpScreen);
    if (
      (isSignUp && signInUpScreen == 4) ||
      (!isSignUp && signInUpScreen == 2)
    ) {
      // Navigate to Home
      console.log("Navigate to bottomscreen navigation");
    } else {
      navigation.dispatch(
        // Using `replace` to prevent multiple `SignInUp` components to access the same states
        StackActions.replace("SignInUp", {
          isSignUp: isSignUp,
          question: isSignUp
            ? signUpQuestions[signInUpScreen + 1]
            : signInQuestions[signInUpScreen + 1],
          textInputPlaceholderText: placeholderTexts[signInUpScreen + 1],
          textInputKeyboardType:
            isSignUp && signInUpScreen == 3 ? "numeric" : "default",
        })
      );
      incrementSignInUpScreen();
    }
  };

  // Change default text if already filled out when navigating to previous screen
  useEffect(() => {
    if (signInUpScreen == 1 && email != "") setText(email);
    else if (signInUpScreen == 3 && name != "") setText(name);
  }, [signInUpScreen]);

  // If Pressable (outside of this scope) is submitted, dispatch action respective to sign in/up screen page from `text`
  useEffect(() => {
    if (isSubmitted) {
      setIsPush(true);
      setIsSubmitted(false); // Reset isSubmitted back to not being presssed/submitted
      setIsTyped(false); // Prevent user from spamming "Continue" button
      if (signInUpScreen == 1) {
        setEmail(text);
        navigateToNextSignInUpScreen();
      } else if (signInUpScreen == 2 && !isUserCreated && !isCreateUserError) {
        // createUserWithEmailAndPassword(FIREBASE_AUTH, email, text)
        //   .then(() => {
        //     console.log("Create user");
        //     setIsUserCreated(true);
        //     console.log("Navigating to next screen??");
        //     navigateToNextSignInUpScreen();
        //   })
        //   .catch((error) => {
        //     console.log("Error code:", error.code);
        //     console.log("Error message:", error.message);
        //     setIsCreateUserError(true);
        //   });
        console.log("Create user");
        setIsUserCreated(true);
        navigateToNextSignInUpScreen();
      } else if (signInUpScreen == 3) {
        setName(text);
        navigateToNextSignInUpScreen();
      } else {
        setBirthday(text);
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
