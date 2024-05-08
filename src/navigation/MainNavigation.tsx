import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@screens/HomeScreen";
import ProfileNavigation from "./ProfileNavigation";
import { MainRouteParams } from "@_types/NavigationTypes";
import TabIcon from "@components/TabIcon";
import { BOTTOM_TAB_BG_COLOR, DARK_BG_COLOR } from "@assets/styles/colors";
import CreateScreen from "@screens/CreateScreen";
import HomeNavigation from "./HomeNavigation";

const BottomTab = createBottomTabNavigator<MainRouteParams>();

export default function MainNavigation() {
  const screenOptions = ({ route }: any) => ({
    // fix typing for this
    tabBarShowLabel: false,
    tabBarStyle: { backgroundColor: BOTTOM_TAB_BG_COLOR, borderTopWidth: 0 },
    tabBarIcon: ({ focused }: any) => {
      if (route.name == "HomeNavigation")
        return (
          <TabIcon
            isFocused={focused}
            focusedIcon={require("@assets/icons/home-icon-focused.png")}
            notFocusedIcon={require("@assets/icons/home-icon.png")}
            iconStyle={{ width: 40, height: 40 }}
          />
        );
      else if (route.name == "Create")
        return (
          <TabIcon
            isFocused={focused}
            focusedIcon={require("@assets/icons/create-icon-focused.png")}
            notFocusedIcon={require("@assets/icons/create-icon.png")}
            iconStyle={{ width: 35, height: 35 }}
          />
        );
      else
        return (
          <TabIcon
            isFocused={focused}
            focusedIcon={require("@assets/icons/profile-icon-focused.png")}
            notFocusedIcon={require("@assets/icons/profile-icon.png")}
            iconStyle={{ width: 40, height: 40 }}
          />
        );
    },
  });

  return (
    <BottomTab.Navigator
      initialRouteName="HomeNavigation"
      screenOptions={screenOptions}
    >
      {/* <BottomTab.Screen
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
          headerStyle: {
            backgroundColor: DARK_BG_COLOR,
            borderBottomWidth: 0,
            height: 100,
            shadowColor: "transparent",
          },
        }}
      /> */}
      <BottomTab.Screen
        name="HomeNavigation"
        component={HomeNavigation}
        options={{ headerShown: false }}
      />
      <BottomTab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          headerTitle: "Create",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Inter-Bold",
            color: "white",
            fontSize: 28,
          },
          headerStyle: {
            backgroundColor: DARK_BG_COLOR,
            borderBottomWidth: 0,
            // height: 100,
            shadowColor: "transparent",
          },
        }}
      />
      <BottomTab.Screen
        name="ProfileNavigation"
        component={ProfileNavigation}
        options={{ headerShown: false }}
      />
    </BottomTab.Navigator>
  );
}
