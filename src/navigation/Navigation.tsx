import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigation from "@navigation/AuthNavigation";
import AuthProvider from "@contexts/AuthProvider";
// import HomeScreen from "@screens/HomeScreen";

// Create stack for navigation
const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AuthNavigation />
      </AuthProvider>
      {/* <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={options} />
      </Stack.Navigator> */}
    </NavigationContainer>
  );
}
