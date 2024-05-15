import { PostNavigationProps, PostRouteParams } from "@_types/NavigationTypes";
import { BOTTOM_TAB_BG_COLOR, DARK_BG_COLOR } from "@assets/styles/colors";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { selectFavColor } from "@redux/userSlice";
import { Image } from "expo-image";
import CameraScreen from "@screens/CameraScreen";
import EditCardScreen from "@screens/EditCardScreen";
import { useLayoutEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Pressable } from "react-native";

const PostStack = createNativeStackNavigator<PostRouteParams>();

export default function PostNavigation({
  navigation,
  route,
}: PostNavigationProps) {
  const insets = useSafeAreaInsets();
  const tabIndictorColor = useSelector(selectFavColor);
  useLayoutEffect(() => {
    // If undefined, default route is "Camera". This can occur in initial screen
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Camera";
    if (routeName === "Camera") {
      navigation.setOptions({
        tabBarStyle: { height: 0 },
        tabBarIndicatorStyle: {
          backgroundColor: "transparent",
        },
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {
          backgroundColor: BOTTOM_TAB_BG_COLOR,
          borderTopWidth: 0,
          paddingBottom: insets.bottom,
        },
        tabBarIndicatorStyle: {
          backgroundColor: tabIndictorColor,
          marginBottom: insets.bottom,
        },
      });
    }
  }, [navigation, route]);

  return (
    <PostStack.Navigator
      initialRouteName="Camera"
      screenOptions={{
        animationTypeForReplace: "pop",
      }}
    >
      <PostStack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <PostStack.Screen
        name="EditCard"
        component={EditCardScreen}
        options={{
          headerShown: true,
          headerTitle: "Post",
          headerTitleStyle: {
            fontFamily: "Inter-Bold",
            fontSize: 24,
            color: "white",
          },
          headerStyle: { backgroundColor: DARK_BG_COLOR },
          headerLeft: () => <></>,
          headerRight: () => (
            <Pressable
              onPress={() =>
                navigation.navigate("PostNavigation", { screen: "Camera" })
              }
            >
              <Image
                source={require("@assets/icons/camera-icon.png")}
                style={{ width: 30, height: 30, margin: 10 }}
              />
            </Pressable>
          ),
        }}
      />
    </PostStack.Navigator>
  );
}
