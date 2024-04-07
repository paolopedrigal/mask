import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import {
  AUTH_MENU_LOG_IN_TEXT_COLOR,
  AUTH_MENU_SIGN_UP_PRESSABLE_COLOR,
  DARK_BG_COLOR,
} from "@assets/styles/colors";

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

type Props = NativeStackScreenProps<AuthRouteParams, "Menu">; // Get props from "SignInUp" route
// Props["navigation"] and Props["route"] also yields types for `navigation` and `route` for React Navigation
// Docs: https://reactnavigation.org/docs/typescript/#type-checking-screens

const styles = StyleSheet.create({
  signInContainer: {
    flex: 1,
    backgroundColor: DARK_BG_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  maskLogo: {
    width: 175,
    height: 77,
  },
  logoContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  credentialsContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  textInputView: {
    borderBottomWidth: 1,
    borderBottomColor: "#A9A9A9",
    width: 250,
    flexDirection: "row",
    paddingBottom: 5,
    alignItems: "center",
  },
  textInput: {
    color: "white",
    fontFamily: "Inter-Regular",
    fontSize: 16,
    width: 180,
  },
  logInSignUpView: {
    marginTop: 30,
    gap: 25,
  },
  logInView: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  haveAnAccountText: {
    color: "white",
    fontFamily: "Inter-Regular",
    fontSize: 16,
  },
  logInText: {
    color: AUTH_MENU_LOG_IN_TEXT_COLOR,
    fontFamily: "Inter-Bold",
    fontSize: 16,
  },
  signUpPressable: {
    backgroundColor: AUTH_MENU_SIGN_UP_PRESSABLE_COLOR,
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
});

export default function AuthMenuScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: "#0C0B44",
        },
        styles.signInContainer,
      ]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior="position">
          <View style={styles.logoContainer}>
            <Image
              source={require("@assets/images/mask-logo.png")}
              style={styles.maskLogo}
            />
          </View>
          <View style={styles.credentialsContainer}>
            <View style={styles.logInSignUpView}>
              <Pressable
                onPress={() =>
                  navigation.navigate("SignInUp", {
                    isSignUp: true,
                    question: "When is your brithday?",
                    textInputPlaceholderText: "MM DD YYYY",
                    textInputKeyboardType: "numeric",
                  })
                }
                style={styles.signUpPressable}
              >
                <Text style={styles.signUpText}>Sign up</Text>
              </Pressable>
              <View style={styles.logInView}>
                <Text style={styles.haveAnAccountText}>Have an account?</Text>
                <Pressable
                  onPress={() =>
                    navigation.navigate("SignInUp", {
                      isSignUp: false,
                      question: "What's your email?",
                      textInputPlaceholderText: "Your email",
                      textInputKeyboardType: "email-address",
                    })
                  }
                >
                  <Text style={styles.logInText}>Log in</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}
