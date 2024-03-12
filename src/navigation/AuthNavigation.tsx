import { KeyboardTypeOptions } from "react-native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import AuthMenuScreen from "@screens/AuthMenuScreen";
import SignInUpScreen from "@screens/SignInUpScreen";
// import SignInUpBackButton from "@components/SignInUpBackButton";

// Route names for the stack navigator
type AuthRouteParams = {
  Menu: undefined; // No parameters signed to SignInUp route
  SignInUp: {
    isSignUp: boolean;
    screenNumber: number;
    question: string;
    textInputPlaceholderText: string;
    textInputKeyboardType: KeyboardTypeOptions;
  };
};

const AuthStack = createNativeStackNavigator<AuthRouteParams>(); // Stack Navigator just for the Sign In/Up Screens

export default function AuthNavigation() {
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
    // headerLeft: () => <SignInUpBackButton />,
    headerTintColor: "white",
    headerBackTitleVisible: false,
    headerShadowVisible: false,
  } as NativeStackNavigationOptions;
  return (
    <AuthStack.Navigator initialRouteName="Menu">
      <AuthStack.Screen
        name="Menu"
        component={AuthMenuScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="SignInUp" // Route name
        component={SignInUpScreen}
        options={options}
      />
    </AuthStack.Navigator>
  );
}
