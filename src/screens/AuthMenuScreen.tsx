import {
  Image,
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
    backgroundColor: "#0C0B44",
    justifyContent: "center",
    alignItems: "center",
  },
  maskLogo: {
    width: 175,
    height: 77,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  credentialsContainer: {
    flex: 1,
    justifyContent: "center",
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
    gap: 12,
  },
  logInPressable: {
    backgroundColor: "#9593E7",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 250,
    borderRadius: 25,
  },
  logInText: {
    color: "white",
    fontFamily: "Inter-Regular",
    fontSize: 16,
  },
  orText: {
    fontFamily: "Inter-Regular",
    color: "#C0C0C0",
    textAlign: "center",
  },
  signUpPressable: {
    backgroundColor: "#D9D9D9",
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
                    isSignUp: false,
                    question: "What's your email?",
                    textInputPlaceholderText: "Your email",
                    textInputKeyboardType: "email-address",
                  })
                }
                style={styles.logInPressable}
              >
                <Text style={styles.logInText}>Log in</Text>
              </Pressable>
              <Text style={styles.orText}>or</Text>
              <Pressable
                onPress={() =>
                  navigation.navigate("SignInUp", {
                    isSignUp: true,
                    question: "What's your email?",
                    textInputPlaceholderText: "Your email",
                    textInputKeyboardType: "email-address",
                  })
                }
                style={styles.signUpPressable}
              >
                <Text style={styles.signUpText}>Sign up</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}
