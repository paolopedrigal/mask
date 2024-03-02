import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import SignInUpScreen from "@screens/SignInUpScreen";
// import SignInScreen from "@screens/SignInScreen";
import SignUpScreen from "@screens/SignUpScreen";

// Route names for the stack navigator
type SignInUpStackRouteNames = {
  SignInUp: undefined; // No parameters signed to SignInUp route
  // SignIn: undefined; // No parameters passed to SignIn route
  SignUp: undefined; // No parameters passed to SignUp route
};

const SignInUpStack = createNativeStackNavigator<SignInUpStackRouteNames>(); // Stack Navigator just for the Sign In/Up Screens

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
    headerBackTitleVisible: false,
    headerTintColor: "white",
    headerShadowVisible: false,
  } as NativeStackNavigationOptions;
  return (
    <SignInUpStack.Navigator initialRouteName="SignInUp">
      <SignInUpStack.Screen
        name="SignInUp"
        component={SignInUpScreen}
        options={{ headerShown: false }}
      />
      {/* <SignInStack.Screen
        name="SignIn" // Route name
        component={SignInScreen}
        options={options}
      /> */}
      <SignInUpStack.Screen
        name="SignUp" // Route name
        component={SignUpScreen}
        options={options}
      />
    </SignInUpStack.Navigator>
  );
}
