import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateScreen from "@screens/CreateScreen";
import HomeScreen from "@screens/HomeScreen";
import ViewProfileScreen from "@screens/ViewProfileScreen";
import { DARK_BG_COLOR } from "@theme/colors";
import { HomeRouteParams } from "@ts/types/navigation";
import { Image } from "expo-image";

const HomeStack = createNativeStackNavigator<HomeRouteParams>();

export default function HomeNavigation() {
  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <Image
              style={{ width: 110, height: 40 }}
              source={require("@assets/images/mask-logo.png")}
            />
          ),
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: DARK_BG_COLOR },
          headerTintColor: "white",
          headerBackTitleVisible: false,
          headerShadowVisible: false,
        }}
      />
      <HomeStack.Screen
        name="ViewProfile"
        component={ViewProfileScreen}
        initialParams={{ userID: "" }} // TODO later
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
