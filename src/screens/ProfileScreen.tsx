import { ScrollView, Text, View } from "react-native";
import { Image, ImageSource } from "expo-image";
import { DARK_BG_COLOR } from "@assets/styles/colors";
import { CARD_HEIGHT } from "@assets/styles/card";
import { useEffect, useState } from "react";
import { fetchFileFromStorage } from "@utils/supabase-utils";
import { ProfileScreenProps } from "@_types/NavigationTypes";
import { supabase } from "supabase";
import { useSelector } from "react-redux";
import { selectUserID } from "@redux/userSlice";
import HandPreview from "@components/HandPreview";

export default function ProfileScreen({ route }: ProfileScreenProps) {
  const userID = useSelector(selectUserID);
  const [profilePic, setProfilePic] = useState<string | ArrayBuffer | null>("");
  const [username, setUsername] = useState<string>("");
  const [favColor, setFavColor] = useState<string>("#000000");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("username, fav_color, profile_pic")
          .eq("user_id", userID);
        if (error) throw error;
        setUsername(data[0].username);
        setFavColor(data[0].fav_color);
      } catch (error: any) {
        console.error("Error from fetching profile data:", error.message);
      }
    };
    if (userID) {
      fetchProfileData();
      fetchFileFromStorage(userID + "/profile.jpg", "profile_pics").then(
        (profilePic) => {
          setProfilePic(profilePic);
        }
      );
    }
  }, [userID]);

  const source: ImageSource = profilePic as ImageSource;

  return (
    <ScrollView
      style={{
        backgroundColor: DARK_BG_COLOR,
        flex: 1,
      }}
    >
      <View
        style={{
          height: CARD_HEIGHT + CARD_HEIGHT / 2,
          backgroundColor: DARK_BG_COLOR,
          alignItems: "center",
        }}
      >
        <Image
          source={source}
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
            margin: 15,
          }}
          cachePolicy={"disk"}
        />
        <Text
          style={{
            color: "#FFFFFF",
            fontFamily: "Inter-Regular",
            paddingVertical: 5,
            paddingHorizontal: 15,
            borderWidth: 1,
            borderColor: "#24245E",
            borderRadius: 2,
          }}
        >
          Edit Profile
        </Text>
        <HandPreview />
      </View>
    </ScrollView>
  );
}
