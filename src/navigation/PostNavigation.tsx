import { PostNavigationProps, PostRouteParams } from "@_types/NavigationTypes";
import { BOTTOM_TAB_BG_COLOR } from "@assets/styles/colors";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraScreen from "@screens/CameraScreen";
import EditCardScreen from "@screens/EditCardScreen";
import { useLayoutEffect } from "react";

const PostStack = createNativeStackNavigator<PostRouteParams>();

export default function PostNavigation({
  navigation,
  route,
}: PostNavigationProps) {
  console.log("route:", getFocusedRouteNameFromRoute(route));

  useLayoutEffect(() => {
    // If undefined, default route is "Camera". This can occur in initial screen
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Camera";
    if (routeName === "Camera") {
      navigation.setOptions({
        headerShown: false,
        tabBarStyle: { display: "none" },
      });
    } else {
      navigation.setOptions({
        headerShown: true,
        tabBarStyle: {
          backgroundColor: BOTTOM_TAB_BG_COLOR,
          borderTopWidth: 0,
        },
      });
    }
  }, [navigation, route]);

  return (
    <PostStack.Navigator initialRouteName="Camera">
      <PostStack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <PostStack.Screen
        name="EditCard"
        component={EditCardScreen}
        options={{ headerShown: false }}
      />
    </PostStack.Navigator>
  );
}
