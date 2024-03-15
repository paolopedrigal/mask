import { NavigationContainer } from "@react-navigation/native";
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import AuthNavigation from "@navigation/AuthNavigation";
import MainNavigation from "./MainNavigation";
import AuthProvider from "@contexts/AuthProvider";

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

  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={options}>
        <AppStack.Screen
          name="AuthenticationNavigation"
          component={AuthenticationNavigation}
        />
        <AppStack.Screen name="MainNavigation" component={MainNavigation} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
