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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { KeyboardTypeOptions } from "react-native";

// Route names for Profile Navigator
type ProfileRouteParams = {
  Profile: undefined;
  EditProfile: undefined;
};

// Route names for the AuthNavigation stack navigator
type AuthRouteParams = {
  Menu: undefined; // No parameters signed to SignInUp route
  SignInUp: {
    isSignUp: boolean;
    question: string;
    textInputPlaceholderText: string;
    textInputKeyboardType: KeyboardTypeOptions;
  };
};

// Route names for Parent Native Stack Navigator
type AppRouteParams = {
  AuthenticationNavigation: undefined;
  MainNavigation: undefined;
};

type ProfileProps = NativeStackScreenProps<ProfileRouteParams, "EditProfile">;
// Props["navigation"] and Props["route"] also yields types for `navigation` and `route` for React Navigation
// Docs: https://reactnavigation.org/docs/typescript/#type-checking-screens

type AuthProps = NativeStackScreenProps<AuthRouteParams, "Menu">; // Get props from "SignInUp" route
// Props["navigation"] and Props["route"] also yields types for `navigation` and `route` for React Navigation
// Docs: https://reactnavigation.org/docs/typescript/#type-checking-screens

type AppProps = NativeStackScreenProps<
  AppRouteParams,
  "AuthenticationNavigation"
>;
// Props["navigation"] and Props["route"] also yields types for `navigation` and `route` for React Navigation
// Docs: https://reactnavigation.org/docs/typescript/#type-checking-screens

type ProfileNavigationProp = ProfileProps["navigation"];
type AuthMenuNavigationProp = AuthProps["navigation"];
type AppNavigationProp = AppProps["navigation"];

const ProfileDrawer = createDrawerNavigator<ProfileRouteParams>();

export default function ProfileNavigation() {
  const profileNavigation = useNavigation<ProfileNavigationProp>();
  const appNavigation = useNavigation<AppNavigationProp>();
  const navigation = useNavigation<any>();

  const navigateBackToProfile = () => {
    profileNavigation.dispatch(DrawerActions.jumpTo("Profile"));
    profileNavigation.dispatch(DrawerActions.openDrawer());
  };
  const navigateToAuthMenu = () => {
    appNavigation.navigate("AuthenticationNavigation");
    profileNavigation.dispatch(DrawerActions.closeDrawer());
  };

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
