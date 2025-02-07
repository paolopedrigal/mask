import SignInUpBackButton from "@components/SignInUpBackButton";
import { AuthContext } from "@contexts/AuthProvider";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import AuthMenuScreen from "@screens/AuthMenuScreen";
import SignInUpScreen from "@screens/SignInUpScreen";
import { DARK_BG_COLOR } from "@theme/colors";
import { AuthContextStates } from "@ts/interfaces/auth-context";
import { AuthRouteParams } from "@ts/types/navigation";
import { useContext } from "react";

const AuthStack = createNativeStackNavigator<AuthRouteParams>(); // Stack Navigator just for the Sign In/Up Screens

export default function AuthNavigation() {
  const { isPush }: AuthContextStates = useContext(
    AuthContext
  ) as AuthContextStates;
  const options = {
    headerShown: true,
    title: "Mask",
    headerTitleStyle: {
      fontFamily: "Inter-Bold",
      color: "white",
      fontSize: 32,
    },
    headerTitleAlign: "center",
    headerStyle: { backgroundColor: DARK_BG_COLOR },
    headerLeft: () => <SignInUpBackButton />,
    headerTintColor: "white",
    headerBackTitleVisible: false,
    headerShadowVisible: false,
    animationTypeForReplace: isPush ? "push" : "pop",
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
