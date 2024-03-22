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
import { User, onAuthStateChanged } from "firebase/auth";

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
  const [currentUser, setCurrentUser] = useState<User | null>(
    FIREBASE_AUTH.currentUser
  );

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        console.log("Still signed in or recently signed in.");
        console.log(user.displayName);
      } else {
        console.log("Not signed in");
      }
      setCurrentUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={options}>
        {currentUser ? (
          <AppStack.Screen name="MainNavigation" component={MainNavigation} />
        ) : (
          <AppStack.Screen
            name="AuthenticationNavigation"
            component={AuthenticationNavigation}
          />
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
