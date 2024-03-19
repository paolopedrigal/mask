import { NavigationContainer } from "@react-navigation/native";
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import AuthNavigation from "@navigation/AuthNavigation";
import MainNavigation from "./MainNavigation";
import AuthProvider from "@contexts/AuthProvider";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

// Route names for Parent Native Stack Navigator
type AppRouteParams = {
  AuthenticationNavigation: undefined;
  MainNavigation: undefined;
};

// Create stack for navigation
const AppStack = createNativeStackNavigator<AppRouteParams>();

function AuthenticationNavigation() {
  return (
    <AuthProvider>
      <AuthNavigation />
    </AuthProvider>
  );
}

export default function Navigation() {
  const options = { headerShown: false } as NativeStackNavigationOptions;
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setIsSignedIn(true);
        console.log("Still signed in or recently signed in.");
      } else {
        setIsSignedIn(false);
        console.log("Not signed in");
      }
    });
  }, [isSignedIn]);

  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={options}>
        {isSignedIn ? (
          <AppStack.Screen
            name="AuthenticationNavigation"
            component={AuthenticationNavigation}
          />
        ) : (
          <></>
        )}
        <AppStack.Screen name="MainNavigation" component={MainNavigation} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
