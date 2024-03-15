import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@screens/HomeScreen";
import ProfileScreen from "@screens/ProfileScreen";

// Route params for bottom tab navigator
type MainRouteParams = {
  Home: undefined;
  Profile: undefined;
};

const BottomTab = createBottomTabNavigator<MainRouteParams>();

export default function MainNavigation() {
  return (
    <BottomTab.Navigator initialRouteName="Home">
      <BottomTab.Screen name="Home" component={HomeScreen} />
      <BottomTab.Screen name="Profile" component={ProfileScreen} />
    </BottomTab.Navigator>
  );
}
