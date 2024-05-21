import { NavigationContainer } from "@react-navigation/native";
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import AuthNavigation from "@navigation/AuthNavigation";
import MainNavigation from "./MainNavigation";
import AuthProvider from "@contexts/AuthProvider";
import { useEffect, useState } from "react";
import { AppRouteParams } from "@_types/NavigationTypes";
import { supabase } from "supabase";
import {
  FriendsInterface,
  setFavColor,
  setFriendsData,
  setName,
  setRequestedFriendsData,
  setUserID,
  setUsername,
} from "@redux/userSlice";
import { useDispatch } from "react-redux";
import { applyShading } from "@utils/utils";

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
  const [currentUser, setCurrentUser] = useState<boolean>(true);
  const dispatch = useDispatch();

  async function fetchUserData(userID: string) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", userID);
      if (error) return null;
      else {
        dispatch(setUserID(userID));
        dispatch(setName(data[0]["name"]));
        dispatch(setUsername(data[0]["username"]));
        dispatch(setFavColor(data[0]["fav_color"]));
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }

  async function fetchFriendsData(userID: string) {
    interface FriendsDataInterface {
      friend_id: { user_id: string; username: string };
      is_friends: boolean;
      requested: boolean;
    }

    try {
      const { data, error } = await supabase
        .from("friends")
        .select("friend_id (user_id, username), is_friends, requested")
        .eq("user_id", userID)
        .returns<FriendsDataInterface[]>();
      if (error) throw error;
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
      console.log("error fetching friendsData");
      console.error(error.message);
    }
  }

  useEffect(() => {
    // Supabase Auth
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setCurrentUser(true);
        const userID: string = session.user.id;
        fetchUserData(userID);
        fetchFriendsData(userID);
      } else setCurrentUser(false);
    });
  }, []);

  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={options}>
        {currentUser ? (
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
