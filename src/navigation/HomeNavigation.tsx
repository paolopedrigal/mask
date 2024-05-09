import { HomeRouteParams } from "@_types/NavigationTypes";
import { DARK_BG_COLOR } from "@assets/styles/colors";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateScreen from "@screens/CreateScreen";
import HomeScreen from "@screens/HomeScreen";
import ViewProfileScreen from "@screens/ViewProfileScreen";

const HomeStack = createNativeStackNavigator<HomeRouteParams>();

export default function HomeNavigation() {
  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: "mask",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Inter-Bold",
            color: "white",
            fontSize: 28,
          },
          headerStyle: { backgroundColor: DARK_BG_COLOR },
          headerTintColor: "white",
          headerBackTitleVisible: false,
          headerShadowVisible: false,
        }}
      />
      <HomeStack.Screen
        name="ViewProfile"
        component={ViewProfileScreen}
        options={{
          headerTitle: "View Profile",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Inter-Bold",
            color: "white",
            fontSize: 20,
          },
          headerStyle: { backgroundColor: DARK_BG_COLOR },
          headerTintColor: "white",
          headerBackTitleVisible: false,
          headerShadowVisible: false,
        }}
      />
      <HomeStack.Screen name="Answer" component={CreateScreen} />
    </HomeStack.Navigator>
  );
}
