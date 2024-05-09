import { Pressable, Text, View } from "react-native";
import { Image, ImageSource } from "expo-image";
import {
  DARK_BG_COLOR,
  HIGH_LUMINANCE_TEXT_COLOR,
  LOW_LUMINANCE_FADED_TEXT_COLOR,
  LOW_LUMINANCE_TEXT_COLOR,
} from "@assets/styles/colors";
import { applyShading, hasHighLuminance } from "@utils/utils";
import { CARD_BORDER_RADIUS } from "@assets/styles/card";
import { PROFILE_BOX_WIDTH } from "@assets/styles/profile";
import { useEffect, useState } from "react";
import {
  selectFavColor,
  selectName,
  selectUserID,
  selectUsername,
} from "@redux/userSlice";
import { useSelector } from "react-redux";
import { fetchFileFromStorage } from "@utils/supabase-utils";
import {
  ProfileScreenProps,
  ViewProfileScreenProps,
} from "@_types/NavigationTypes";
import { supabase } from "supabase";

const user = {
  id: 1,
  name: "Paolo",
  username: "boombampao",
  profilePic: require("@assets/images/test-pfp.jpg"),
  favoriteColor: "#ABAB90", // "#0E420A",
  listOfBestFriends: [
    {
      id: 2,
      name: "Maika",
      username: "maikaroni",
      profilePic: require("@assets/images/test-pfp.jpg"),
      favoriteColor: "#D29DDB",
    },
    {
      id: 3,
      name: "Jason",
      username: "buansanity",
      profilePic: require("@assets/images/test-pfp.jpg"),
      favoriteColor: "#273B4A",
    },
    {
      id: 4,
      name: "Jason",
      username: "buansanity",
      profilePic: require("@assets/images/test-pfp.jpg"),
      favoriteColor: "#273B4A",
    },
  ],
};

const month = {
  month: "April",
  startingDay: "M",
  startingDayOffset: 1, // Sunday is 0
  numDays: 30,
};

export default function ProfileScreen({ route }: ViewProfileScreenProps) {
  const { userID } = route.params;
  const [profilePic, setProfilePic] = useState<string | ArrayBuffer | null>("");
  const [username, setUsername] = useState<string>("");
  const [favColor, setFavColor] = useState<string>("#000000");

  useEffect(() => {
    // fetchFileFromStorage(userID + "/profile.jpg", "profile_pics").then(
    //   (profilePic) => {
    //     setProfilePic(profilePic);
    //   }
    // );

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
        console.error("Error from ViewProfile:", error.message);
      }
    };
    if (userID != "") fetchProfileData();
  }, []);

  const source: ImageSource = profilePic as ImageSource;

  console.log("username:", username);
  return (
    <View
      style={{ flex: 1, backgroundColor: DARK_BG_COLOR, alignItems: "center" }}
    >
      <Image
        source={source}
        style={{
          width: 135,
          height: 135,
          borderRadius: 100,
          borderWidth: 3,
          borderColor: "#FFFFFF",
          marginTop: 15,
        }}
      />
      {/* <Text
        style={{
          color: LOW_LUMINANCE_TEXT_COLOR,
          fontFamily: "Inter-Bold",
          fontSize: 20,
          padding: 10,
        }}
      >
        {profile.name}
      </Text> */}
      <Text
        style={{
          color: LOW_LUMINANCE_TEXT_COLOR,
          fontFamily: "Inter-Regular",
          fontSize: 18,
          padding: 10,
        }}
      >
        {username}
      </Text>
      <View
        style={{
          backgroundColor: favColor,
          width: PROFILE_BOX_WIDTH,
          borderRadius: CARD_BORDER_RADIUS,
          paddingHorizontal: 10,
          paddingVertical: 5,
          margin: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              color: hasHighLuminance(favColor)
                ? HIGH_LUMINANCE_TEXT_COLOR
                : LOW_LUMINANCE_TEXT_COLOR,
              fontSize: 16,
            }}
          >
            Best Friends
          </Text>
          <Image
            source={require("@assets/icons/right-arrow-icon.png")}
            style={{ width: 6, height: 11 }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {user.listOfBestFriends.map((friend) => (
            <Image
              source={friend.profilePic}
              key={friend.id}
              style={{
                width: 45,
                height: 45,
                borderWidth: 1,
                borderColor: "#FFFFFF",
                borderRadius: 100,
                marginHorizontal: 8,
                marginVertical: 10,
              }}
            />
          ))}
        </View>
      </View>
      <View
        style={{
          backgroundColor: favColor,
          width: PROFILE_BOX_WIDTH,
          borderRadius: CARD_BORDER_RADIUS,
          padding: 10,
          margin: 10,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontFamily: "Inter-Regular",
            fontSize: 16,
            paddingHorizontal: 10,
            paddingTop: 10,
          }}
        >
          {month.month}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 5 }}>
          {[...Array(35).keys()].map((_, index: number) => {
            if (
              index >= month.startingDayOffset &&
              index - month.startingDayOffset < month.numDays
            ) {
              return Math.random() < 0.5 ? (
                <View
                  key={index}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: "white",
                    marginHorizontal: 10,
                    marginVertical: 5,
                    borderColor: "white",
                    borderWidth: 1,
                  }}
                ></View>
              ) : (
                <View
                  key={index}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: "transparent",
                    marginHorizontal: 10,
                    marginVertical: 5,
                    borderColor: "white",
                    borderWidth: 1,
                  }}
                ></View>
              );
            } else
              return (
                <View
                  key={index}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: "transparent",
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}
                ></View>
              );
          })}
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Pressable
            style={{
              backgroundColor: applyShading(favColor),
              borderRadius: 25,
              width: 75,
              height: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Inter-Regular",
                color: LOW_LUMINANCE_FADED_TEXT_COLOR,
              }}
            >
              View all
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
