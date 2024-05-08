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
  MainNavigationProps,
  SignInUpProps,
  SignInUpJSONType,
  SignInUpValues,
} from "@_types/NavigationTypes";
import {
  AUTH_PLACEHOLDER_TEXT_COLOR,
  SELECTION_COLOR,
} from "@assets/styles/colors";
import { supabase } from "supabase";
import { CARD_FONT_SIZE } from "@assets/styles/card";

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: "row",
    width: "90%",
  },
  textInput: {
    fontFamily: "Inter-Bold",
    fontSize: CARD_FONT_SIZE,
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

  async function signUpNewUser(password: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) setIsCreateUserError(true);
  }

  async function signInWithEmail(password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) setIsCreateUserError(true);
  }

  const navigateToNextSignInUpScreen = () => {
    if (
      (isSignUp && signInUpScreen == 4) ||
      (!isSignUp && signInUpScreen == 2)
    ) {
      mainNavigation.navigate("MainNavigation", {
        screen: "HomeNavigation",
        params: { screen: "Home" },
      });
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
        // Supabase Auth
        signInWithEmail(text).then(() => {
          navigateToNextSignInUpScreen();
          console.log("Finish signing in");
        });
      } else if (signInUpScreen == 4 && isSignUp) {
        // Supabase sign up
        signUpNewUser(text).then(() => {
          navigateToNextSignInUpScreen();
          console.log("Finish signing up");
        });
      } else {
        // Would be (isSignUp && signInUpScreen == 2)
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
        placeholderTextColor={AUTH_PLACEHOLDER_TEXT_COLOR}
        selectionColor={SELECTION_COLOR}
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
          placeholderTextColor={AUTH_PLACEHOLDER_TEXT_COLOR}
          selectionColor={SELECTION_COLOR}
          numberOfLines={1} // Ensure only one line is visible
          style={[
            styles.textInput,
            text.length > 15 ? { fontSize: 24 } : { fontSize: CARD_FONT_SIZE }, // Change fontSize to 24 if text input is too long (i.e. longer than 15 characters)
          ]}
        />
      </ScrollView>
    );
  }
}
