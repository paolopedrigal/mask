import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  DrawerToggleButton,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { HeaderBackButton } from "@react-navigation/elements";
import ProfileScreen from "@screens/ProfileScreen";
import EditProfileScreen from "@screens/EditProfileScreen";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { ProfileRouteParams, EditProfileProps } from "@_types/NavigationTypes";
import { DARK_BG_COLOR } from "@assets/styles/colors";
import { supabase } from "supabase";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { selectUsername } from "@redux/userSlice";
import Hand from "@components/Hand";

const ProfileDrawer = createDrawerNavigator<ProfileRouteParams>();

export default function ProfileNavigation() {
  const profileNavigation = useNavigation<EditProfileProps["navigation"]>();

  const navigateBackToProfile = (preOpen: boolean) => {
    profileNavigation.dispatch(DrawerActions.jumpTo("Profile"));
    if (preOpen) profileNavigation.dispatch(DrawerActions.openDrawer());
  };

  // Ensure drawer is closed when rendered for first time
  useEffect(() => {
    profileNavigation.dispatch(DrawerActions.closeDrawer());
  }, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    console.log("signing out");
    if (error) console.log("error in signing out");
  }

  return (
    <ProfileDrawer.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: "Inter-Bold",
          textAlign: "center",
          fontSize: 24,
          color: "white",
        },
        drawerPosition: "right",
        headerLeft: () => <></>,
        headerRight: () => <DrawerToggleButton />,
      }}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label="Logout" onPress={() => signOut()} />
          </DrawerContentScrollView>
        );
      }}
    >
      <ProfileDrawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerItemStyle: { display: "none" },
          headerStyle: {
            backgroundColor: DARK_BG_COLOR,
          },
          headerTitleAlign: "center",
          headerTitle: useSelector(selectUsername),
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter-Regular",
            color: "#FFFFFF",
          },
          headerLeft: () => (
            <Pressable style={{ paddingHorizontal: 25 }}>
              <Image
                source={require("@assets/icons/add-friend-icon.png")}
                style={{ width: 25, height: 20 }}
                cachePolicy={"disk"}
              />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              style={{ paddingHorizontal: 25 }}
              onPress={() =>
                profileNavigation.dispatch(DrawerActions.openDrawer())
              }
            >
              <Image
                source={require("@assets/icons/settings-icon.png")}
                style={{ width: 25, height: 25 }}
                cachePolicy={"disk"}
              />
            </Pressable>
          ),
        }}
      />
      <ProfileDrawer.Screen
        name="Hand"
        component={Hand}
        options={{
          swipeEnabled: false,
          drawerItemStyle: { display: "none" },
          headerStyle: {
            backgroundColor: DARK_BG_COLOR,
          },
          headerTitleAlign: "center",
          headerTitle: useSelector(selectUsername),
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter-Regular",
            color: "#FFFFFF",
          },
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => navigateBackToProfile(false)}
              labelVisible={false}
              tintColor="#A9A9A9"
              style={{
                padding: 20,
              }}
            />
          ),
          headerRight: () => <></>,
        }}
      />

      <ProfileDrawer.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          swipeEnabled: false,
          headerStyle: {
            backgroundColor: DARK_BG_COLOR,
          },
          headerTitle: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => navigateBackToProfile(true)}
              labelVisible={false}
              tintColor="#A9A9A9"
              style={{
                padding: 20,
              }}
            />
          ),
          headerRight: () => <></>,
        }}
      />
    </ProfileDrawer.Navigator>
  );
}
