import MainNavigation from "./MainNavigation";
import AuthProvider from "@contexts/AuthProvider";
import AuthNavigation from "@navigation/AuthNavigation";
import { NavigationContainer } from "@react-navigation/native";
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { supabase } from "@services/supabase/client";
import {
  fetchMainUserData,
  fetchMainUserFriendsData,
} from "@services/supabase/database/fetch";
import { fetchFileFromStorage } from "@services/supabase/storage/fetch";
import {
  FriendsInterface,
  setFavColor,
  setFriendsData,
  setRequestedFriendsData,
  setUserID,
  setUserProfilePic,
  setUsername,
} from "@store/slices/user";
import { AppRouteParams } from "@ts/types/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ImageSource } from "expo-image";

// Create stack for navigation
const AppStack = createNativeStackNavigator<AppRouteParams>();

function AuthenticationNavigation() {
  return (
    <AuthProvider>
      <AuthNavigation />
    </AuthProvider>
  );
}

export default function Navigation() {
  const options = { headerShown: false } as NativeStackNavigationOptions;
  const [existsCurrentUser, setExistsCurrentUser] = useState<boolean>(true);
  const dispatch = useDispatch();

  /**
   * Fetches information on user signed in and stores it in global state
   *
   * @param userID id stored at database (i.e. Supabase)
   */
  const updateMainUserState = async (userID: string) => {
    try {
      const { data, error } = await fetchMainUserData(userID);
      if (error || data == null) return null;
      else {
        dispatch(setUserID(userID));
        dispatch(setUsername(data[0]["username"]));
        dispatch(setFavColor(data[0]["fav_color"]));

        fetchFileFromStorage(userID + "/profile.jpg", "profile_pics").then(
          (profilePic) => {
            if (profilePic)
              dispatch(setUserProfilePic(profilePic as ImageSource));
          }
        );
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  /**
   * Fetches friends information from database then updates global state on current main user's
   * (potential) friends.
   *
   * @param userID id stored at database (i.e. Supabase)
   */
  const updateMainUserFriendsState = async (userID: string) => {
    try {
      const { data, error } = await fetchMainUserFriendsData(userID);
      if (error || data == null) throw error;
      let friendIDs: FriendsInterface = {};
      let requestedFriendIDs: FriendsInterface = {};
      for (let i: number = 0; i < data.length; i++) {
        if (data[i].is_friends)
          friendIDs[data[i]["friend_id"]["user_id"]] = {
            username: data[i]["friend_id"]["username"],
          };
        else if (data[i].requested)
          requestedFriendIDs[data[i]["friend_id"]["user_id"]] = {
            username: data[i]["friend_id"]["username"],
          };
      }
      dispatch(setFriendsData(friendIDs));
      dispatch(setRequestedFriendsData(requestedFriendIDs));
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    // Supabase Auth
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setExistsCurrentUser(true);
        const userID: string = session.user.id;
        updateMainUserState(userID);
        updateMainUserFriendsState(userID);
      } else setExistsCurrentUser(false);
    });
  }, []);

  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={options}>
        {existsCurrentUser ? (
          <AppStack.Screen name="MainNavigation" component={MainNavigation} />
        ) : (
          <AppStack.Screen
            name="AuthenticationNavigation"
            component={AuthenticationNavigation}
          />
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
