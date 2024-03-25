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
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { useEffect } from "react";
import {
  ProfileRouteParams,
  EditProfileProps,
  AuthenticationNavigationProps,
} from "@_types/AuthTypes";

const ProfileDrawer = createDrawerNavigator<ProfileRouteParams>();

export default function ProfileNavigation() {
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

  return (
    <ProfileDrawer.Navigator
      initialRouteName="Profile"
      screenOptions={{
        drawerPosition: "right",
        headerLeft: () => <></>,
        headerRight: () => <DrawerToggleButton />,
      }}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="Logout"
              onPress={() =>
                signOut(FIREBASE_AUTH).then(() => {
                  navigateToAuthMenu();
                  console.log("logging out");
                })
              }
            />
          </DrawerContentScrollView>
        );
      }}
    >
      <ProfileDrawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerItemStyle: { display: "none" },
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
