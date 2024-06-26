import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileNavigation from "./ProfileNavigation";
import { MainRouteParams } from "@_types/NavigationTypes";
import TabIcon from "@components/TabIcon";
import { BOTTOM_TAB_BG_COLOR } from "@assets/styles/colors";
import HomeNavigation from "./HomeNavigation";
import PostNavigation from "./PostNavigation";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BottomTab = createMaterialTopTabNavigator<MainRouteParams>();

export default function MainNavigation() {
  const insets = useSafeAreaInsets();
  const screenOptions = ({ route }: any) => ({
    swipeEnabled: false,
    tabBarIndicatorStyle: {
      backgroundColor: "transparent",
    },
    tabBarShowLabel: false,
    tabBarStyle: {
      backgroundColor: BOTTOM_TAB_BG_COLOR,
      borderTopWidth: 0,
      paddingBottom: insets.bottom,
    },
    tabBarIconStyle: {
      width: 35,
      height: 35,
    },
    tabBarIcon: ({ focused }: any) => {
      if (route.name == "HomeNavigation")
        return (
          <TabIcon
            isFocused={focused}
            focusedIcon={require("@assets/icons/home-icon-focused.png")}
            notFocusedIcon={require("@assets/icons/home-icon.png")}
            iconStyle={{
              width: 35,
              height: 35,
            }}
          />
        );
      else if (route.name == "PostNavigation")
        return (
          <TabIcon
            isFocused={focused}
            focusedIcon={require("@assets/icons/post-icon-focused.png")}
            notFocusedIcon={require("@assets/icons/post-icon.png")}
            iconStyle={{ width: 30, height: 30 }}
          />
        );
      else
        return (
          <TabIcon
            isFocused={focused}
            focusedIcon={require("@assets/icons/profile-icon-focused.png")}
            notFocusedIcon={require("@assets/icons/profile-icon.png")}
            iconStyle={{
              width: 35,
              height: 35,
            }}
          />
        );
    },
  });

  return (
    <BottomTab.Navigator
      initialRouteName="HomeNavigation"
      tabBarPosition="bottom"
      screenOptions={screenOptions}
    >
      <BottomTab.Screen
        name="PostNavigation"
        component={PostNavigation}
        options={{
          title: "Post",
          tabBarIndicatorStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
      <BottomTab.Screen name="HomeNavigation" component={HomeNavigation} />
      <BottomTab.Screen
        name="ProfileNavigation"
        component={ProfileNavigation}
      />
    </BottomTab.Navigator>
  );
}
