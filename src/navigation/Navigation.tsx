import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInUpNavigation from "@navigation/SignInUpNavigation";
// import HomeScreen from "@screens/HomeScreen";

// Create stack for navigation
const Stack = createNativeStackNavigator();

export default function Navigation() {
  const options = { headerShown: false };

  return (
    <NavigationContainer>
      <SignInUpNavigation />
      {/* <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={options} />
      </Stack.Navigator> */}
    </NavigationContainer>
  );
}
