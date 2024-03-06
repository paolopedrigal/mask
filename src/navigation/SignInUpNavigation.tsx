import { KeyboardTypeOptions } from "react-native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import SignInUpMenuScreen from "@screens/SignInUpMenuScreen";
// import SignInScreen from "@screens/SignInScreen";
import SignInUpScreen from "@screens/SignInUpScreen";
import SignInUpBackButton from "@components/SignInUpBackButton";

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

const SignInUpStack = createNativeStackNavigator<SignInUpStackRouteParams>(); // Stack Navigator just for the Sign In/Up Screens

export default function SignInLayout() {
  const options = {
    headerShown: true,
    title: "Mask",
    headerTitleStyle: {
      fontFamily: "Inter-Bold",
      color: "white",
      fontSize: 32,
    },
    headerTitleAlign: "center",
    headerStyle: { backgroundColor: "#0C0B44" },
    headerLeft: () => <SignInUpBackButton />,
    headerBackTitleVisible: false,
    headerShadowVisible: false,
  } as NativeStackNavigationOptions;
  return (
    <SignInUpStack.Navigator initialRouteName="Menu">
      <SignInUpStack.Screen
        name="Menu"
        component={SignInUpMenuScreen}
        options={{ headerShown: false }}
      />
      <SignInUpStack.Screen
        name="SignInUp" // Route name
        component={SignInUpScreen}
        options={options}
      />
    </SignInUpStack.Navigator>
  );
}
