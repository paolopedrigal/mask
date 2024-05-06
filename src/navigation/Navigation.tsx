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
  setFriendsIDs,
  setName,
  setUserID,
  setUsername,
} from "@redux/userSlice";
import { useDispatch } from "react-redux";

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
    try {
      const { data, error } = await supabase
        .from("friends")
        .select("friend_id")
        .eq("user_id", userID)
        .eq("is_friends", true);
      if (error) throw error;
      let friendsIDs: FriendsInterface = {};
      for (let i: number = 0; i < data.length; i++) {
        friendsIDs[data[i].friend_id] = true;
      }
      dispatch(setFriendsIDs(friendsIDs));
    } catch (error: any) {
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
