import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardTypeOptions } from "react-native";

////////////////////////////////// React Navigation Type checking /////////////////////////

// Route names for Parent Native Stack Navigator
export type AppRouteParams = {
  AuthenticationNavigation: NavigatorScreenParams<AuthRouteParams>;
  MainNavigation: NavigatorScreenParams<MainRouteParams>;
};

// Route names for the AuthNavigation stack navigator
export type AuthRouteParams = {
  Menu: undefined; // No parameters signed to SignInUp route
  SignInUp: {
    isSignUp: boolean;
    question: string;
    textInputPlaceholderText: string;
    textInputKeyboardType: KeyboardTypeOptions;
  };
};

// Route params for bottom tab navigator
export type MainRouteParams = {
  HomeNavigation: NavigatorScreenParams<HomeRouteParams>;
  Create: undefined;
  ProfileNavigation: NavigatorScreenParams<ProfileRouteParams>;
};

// Route names for Home Navigator
export type HomeRouteParams = {
  Home: undefined;
  ViewProfile: {
    userID: string;
  };
  Answer: undefined;
};

// Route names for Profile Navigator
export type ProfileRouteParams = {
  Profile: {
    userID: string;
    // friendStatus?: "friend" | "requested" | "addFriend";
  };
  EditProfile: undefined;
};

// Contains ["navigation", "route"] props for specified screens
export type MainNavigationProps = NativeStackScreenProps<
  AppRouteParams,
  "MainNavigation"
>;
export type AuthenticationNavigationProps = NativeStackScreenProps<
  AppRouteParams,
  "AuthenticationNavigation"
>;
export type SignInUpProps = NativeStackScreenProps<AuthRouteParams, "SignInUp">;
export type ProfileScreenProps = NativeStackScreenProps<
  ProfileRouteParams,
  "Profile"
>;
export type ViewProfileScreenProps = NativeStackScreenProps<
  HomeRouteParams,
  "ViewProfile"
>;
export type EditProfileProps = NativeStackScreenProps<
  ProfileRouteParams,
  "EditProfile"
>;
export type HomeProps = NativeStackScreenProps<HomeRouteParams, "Home">;

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////// Refers to @assets/json/sign-in-up.json //////////////////////
type SignInUpKeys =
  | "sign-up-questions"
  | "sign-in-questions"
  | "sign-up-place-holder-texts"
  | "sign-in-place-holder-texts";

export interface SignInUpValues {
  [index: string]: string;
}

export type SignInUpJSONType = {
  [key in SignInUpKeys]: SignInUpValues;
};
///////////////////////////////////////////////////////////////////////////////////////////////
