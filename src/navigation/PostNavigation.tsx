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
import { HeaderBackButton } from "@react-navigation/elements";
import PostCardScreen from "@screens/PostCardScreen";

const PostStack = createNativeStackNavigator<PostRouteParams>();

export default function PostNavigation({
  navigation,
  route,
}: PostNavigationProps) {
  const insets = useSafeAreaInsets();
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
          backgroundColor: "transparent",
          marginBottom: insets.bottom,
        },
      });
    }
  }, [navigation, route]);

  return (
    <PostStack.Navigator
      initialRouteName="Camera"
      screenOptions={{
        headerShown: true,
        headerTitle: "Post",
        headerTitleStyle: {
          fontFamily: "Inter-Bold",
          fontSize: 24,
          color: "white",
        },
        headerStyle: { backgroundColor: DARK_BG_COLOR },
      }}
    >
      <PostStack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          headerShown: false,
          animation: "fade",
          headerLeft: () => <></>,
          headerRight: () => <></>,
        }}
      />
      <PostStack.Screen
        name="EditCard"
        component={EditCardScreen}
        options={{
          animation: "fade",
          headerLeft: () => (
            <Pressable
              onPress={() =>
                navigation.navigate("PostNavigation", { screen: "Camera" })
              }
            >
              <Image
                source={require("@assets/icons/camera-icon.png")}
                style={{ width: 30, height: 30, margin: 20 }}
              />
            </Pressable>
          ),
          headerRight: () => <></>,
        }}
      />
      <PostStack.Screen
        name="PostCard"
        component={PostCardScreen}
        options={{
          animation: "slide_from_bottom",
          gestureEnabled: true,
          gestureDirection: "vertical",
          headerLeft: () => (
            <HeaderBackButton
              // labelVisible={false}
              label="Edit Card"
              backImage={() => <></>}
              tintColor="#FFFFFF"
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 5 }}
              // style={{fontSize: ""}}
              labelStyle={{ fontSize: 15, color: "#F26B6B" }}
            />
          ),
        }}
      />
    </PostStack.Navigator>
  );
}
