import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@screens/HomeScreen";
import ProfileNavigation from "./ProfileNavigation";

// Route params for bottom tab navigator
type MainRouteParams = {
  Home: undefined;
  ProfileNavigation: undefined;
};

const BottomTab = createBottomTabNavigator<MainRouteParams>();

export default function MainNavigation() {
  return (
    <BottomTab.Navigator initialRouteName="Home">
      <BottomTab.Screen name="Home" component={HomeScreen} />
      <BottomTab.Screen
        name="ProfileNavigation"
        component={ProfileNavigation}
        options={{ headerShown: false }}
      />
    </BottomTab.Navigator>
  );
}
