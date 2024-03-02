import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Card from "@components/Card";

// Route names for the stack navigator
type SignInUpStackRouteNames = {
  SignInUp: undefined; // No parameters signed to SignInUp route
  // SignIn: undefined; // No parameters passed to SignIn route
  SignUp: undefined; // No parameters passed to SignUp route
};

type Props = NativeStackScreenProps<SignInUpStackRouteNames, "SignUp">; // Get props from "SignIn" route (i.e. undefined in this case)
// Props["navigation"] and Props["route"] also yields types for `navigation` and `route` for React Navigation
// Docs: https://reactnavigation.org/docs/typescript/#type-checking-screens

const styles = StyleSheet.create({
  signUpContainer: {
    flex: 1,
  },
});

export default function SignUpScreen({ navigation }: Props) {
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
        styles.signUpContainer,
      ]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior="position">
          <Card
            backgroundColorStyle="#7A7ACA"
            text="What is your phone number?"
            authorText="Sign Up (1 of 4)"
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}
