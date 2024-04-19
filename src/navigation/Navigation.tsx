import { NavigationContainer } from "@react-navigation/native";
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import AuthNavigation from "@navigation/AuthNavigation";
import MainNavigation from "./MainNavigation";
import AuthProvider from "@contexts/AuthProvider";
import { useEffect, useState } from "react";
import { AppRouteParams } from "@_types/AuthTypes";
import { supabase } from "supabase";
import { setFavColor, setName, setUserID, setUsername } from "@redux/userSlice";
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
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userID);
    console.log("userData from fetchUserData:", data);
    if (error) return null;
    else {
      dispatch(setUserID(userID));
      dispatch(setName(data[0]["name"]));
      dispatch(setUsername(data[0]["username"]));
      dispatch(setFavColor(data[0]["fav_color"]));
    }
  }

  useEffect(() => {
    // Supabase Auth
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setCurrentUser(true);
        const userID: string = session.user.id;
        fetchUserData(userID);
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
