import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardTypeOptions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Card from "@components/Card";
import SignInUpTextInput from "@components/SignInUpTextInput";
import { useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextStates } from "@contexts/AuthProvider";

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

const styles = StyleSheet.create({
  signUpContainer: {
    flex: 1,
    backgroundColor: "#0C0B44",
    justifyContent: "center",
    alignItems: "center",
  },
  textInputView: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#24245E",
    padding: 10,
    width: "100%",
  },
  signUpPressable: {
    backgroundColor: "#404051",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 250,
    borderRadius: 25,
  },
  signUpText: {
    color: "black",
    fontFamily: "Inter-Regular",
    fontSize: 16,
  },
  pressableView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
});

export default function SignInUpScreen({ route }: Props) {
  const insets = useSafeAreaInsets();
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : 0;
  const {
    setIsSignUpState,
    isTyped,
    setIsSubmitted,
    signInUpScreen,
    isCreateUserError,
  }: AuthContextStates = useContext(AuthContext) as AuthContextStates;
  const {
    isSignUp,
    question,
    textInputPlaceholderText,
    textInputKeyboardType,
  } = route.params; // Route params

  // Text for Pressable button
  let pressableText: string;
  if (isSignUp && signInUpScreen == 4) {
    pressableText = "Finish";
  } else if (!isSignUp && signInUpScreen == 2) {
    pressableText = "Log back in";
  } else {
    pressableText = "Continue";
  }

  // Text for card text
  const authorText: string = isSignUp
    ? "Sign Up (" + signInUpScreen + " of 4)"
    : "Sign In (" + signInUpScreen + " of 2)";

  // Callback function for submitting to next screen
  const submit = () => {
    setIsSubmitted(true);
    Keyboard.dismiss(); // Dismiss keyboard (if user didn't dissmiss it themselves)
  };

  // Detect error upon creating a user
  useEffect(() => {
    if (isCreateUserError) {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    }
  }, [isCreateUserError]);

  // Update Auth Context states upon initial render
  useEffect(() => {
    // Update `isSignUpState` whether if sign up screen or not
    if (isSignUp) setIsSignUpState(true);
    else setIsSignUpState(false);
  }, []);

  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        styles.signUpContainer,
      ]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <Card
            backgroundColorStyle="#7A7ACA"
            text={question}
            authorText={authorText}
          />
          <View style={styles.textInputView}>
            <SignInUpTextInput
              keyboardType={textInputKeyboardType}
              placeholderText={textInputPlaceholderText}
              isSignUp={isSignUp}
            />
          </View>
          <View style={styles.pressableView}>
            <Pressable
              onPress={() => {
                if (isTyped) submit();
              }}
              style={[
                styles.signUpPressable,
                isTyped ? { backgroundColor: "white" } : styles.signUpPressable,
              ]}
            >
              <Text style={styles.signUpText}>{pressableText}</Text>
            </Pressable>
          </View>
          {showErrorMessage ? (
            <View>
              <Text style={{ color: "white" }}>
                Sorry, invalid email/password.
              </Text>
            </View>
          ) : (
            <></>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}
