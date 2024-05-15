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
import {
  ProfileRouteParams,
  EditProfileProps,
  AuthenticationNavigationProps,
} from "@_types/NavigationTypes";
import { DARK_BG_COLOR } from "@assets/styles/colors";
import { supabase } from "supabase";
import { useSelector } from "react-redux";
import { selectUserID } from "@redux/userSlice";

const ProfileDrawer = createDrawerNavigator<ProfileRouteParams>();

export default function ProfileNavigation() {
  const userID = useSelector(selectUserID);
  const profileNavigation = useNavigation<EditProfileProps["navigation"]>();
  const authNavigation =
    useNavigation<AuthenticationNavigationProps["navigation"]>();

  const navigateBackToProfile = () => {
    profileNavigation.dispatch(DrawerActions.jumpTo("Profile"));
    profileNavigation.dispatch(DrawerActions.openDrawer());
  };
  const navigateToAuthMenu = () => {
    authNavigation.navigate("AuthenticationNavigation", { screen: "Menu" });
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
        initialParams={{ userID: userID }}
        options={{
          drawerItemStyle: { display: "none" },
          headerStyle: { backgroundColor: DARK_BG_COLOR },
          headerTitleAlign: "center",
        }}
      />
      <ProfileDrawer.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerLeft: () => (
            <HeaderBackButton onPress={navigateBackToProfile} />
          ),
          headerRight: () => <></>,
        }}
      />
    </ProfileDrawer.Navigator>
  );
}
