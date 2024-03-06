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
import { useDispatch, useSelector } from "react-redux";
import {
  selectSignInUpScreen,
  setSubmit,
  incrementSignInUpScreen,
  selectIsTyped,
} from "@redux/authSlice";
import Card from "@components/Card";
import SignInUpTextInput from "@components/SignInUpTextInput";
import { useEffect } from "react";

// Route names for the stack navigator
type SignInUpStackRouteParams = {
  Menu: undefined; // No parameters signed to SignInUp route
  SignInUp: {
    isSignUp: boolean;
    question: string;
    textInputPlaceholderText: string;
    textInputKeyboardType: KeyboardTypeOptions;
  };
};

type Props = NativeStackScreenProps<SignInUpStackRouteParams, "SignInUp">; // Get props from "SignIn" route (i.e. undefined in this case)
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

interface signInUpQuestionsInterface {
  [index: number]: string;
}

interface placeholderTextsInterface {
  [index: number]: string;
}

const signUpQuestions: signInUpQuestionsInterface = {
  1: "What's your email?",
  2: "What will be your password?",
  3: "Your name?",
  4: "Birthday? Last question, we promise.",
};

const signInQuestions: signInUpQuestionsInterface = {
  1: "What's your email?",
  2: "And password?",
};

const placeholderTexts: placeholderTextsInterface = {
  1: "Your email",
  2: "Your password",
  3: "Your name",
  4: "MM DD YYYY",
};

// enum signInUpKeys {
//   "sign-up-questions",
//   "sign-in-questions",
//   "place-holder-texts",
// }

// interface signInUpValues {
//   [index: string]: string;
// }

// type signInUpJSONType = {
//   [key in signInUpKeys]: signInUpValues;
// };

// // Get JSON data from "@assets/json/sign-in-up.json"
// const signInUpJSON: signInUpJSONType = require("@assets/json/sign-in-up.json");
// const signUpQuestions: signInUpValues =
//   signInUpJSON[signInUpKeys["sign-up-questions"]];
// const signInQuestions: signInUpValues =
//   signInUpJSON[signInUpKeys["sign-in-questions"]];
// const placeholderTexts: signInUpValues =
//   signInUpJSON[signInUpKeys["place-holder-texts"]];

export default function SignInUpScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : 0;
  const signInUpScreen: number = useSelector(selectSignInUpScreen); // Screen number for Sign Up (i.e. 1-4)
  const isTyped: boolean = useSelector(selectIsTyped);
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

  // Submit logic
  const submit = () => {
    dispatch(setSubmit(true)); // Notify other components that Pressable is submitted
    dispatch(incrementSignInUpScreen()); // Moving to next Sign In/Up screen if not last screen
    dispatch(setSubmit(false)); // Reset `isSubmit` state to false for new screen

    Keyboard.dismiss(); // Dismiss keyboard (if user didn't dissmiss it themselves)

    // Navigate to next screen
    if (
      (isSignUp && signInUpScreen == 4) ||
      (!isSignUp && signInUpScreen == 2)
    ) {
      // Navigate to Home
      console.log("Navigate to bottomscreen navigation");
    } else {
      navigation.push("SignInUp", {
        isSignUp: isSignUp,
        question: isSignUp
          ? signUpQuestions[signInUpScreen + 1]
          : signInQuestions[signInUpScreen + 1],
        textInputPlaceholderText: placeholderTexts[signInUpScreen + 1],
        textInputKeyboardType:
          isSignUp && signInUpScreen == 3 ? "numeric" : "default",
      });
    }
  };

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
              signInUpScreen={signInUpScreen}
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
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}
