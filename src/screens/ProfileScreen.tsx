import { Pressable, ScrollView, Text, View } from "react-native";
import { Image, ImageSource } from "expo-image";
import { DARK_BG_COLOR, DARK_BORDER_COLOR } from "@assets/styles/colors";
import { CARD_HEIGHT } from "@assets/styles/card";
import { useEffect, useState } from "react";
import { fetchFileFromStorage } from "@utils/supabase-utils";
import { ProfileScreenProps } from "@_types/NavigationTypes";
import { supabase } from "supabase";
import { useSelector } from "react-redux";
import { selectUserID, selectUserProfilePic } from "@redux/userSlice";
import HandPreview from "@components/HandPreview";
import { DrawerActions } from "@react-navigation/native";

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const userID: string = useSelector(selectUserID);
  const [profilePic, setProfilePic] = useState<ImageSource>(
    useSelector(selectUserProfilePic)
  );
  // Not commiting these temp pictures
  const [handImages, setHandImages] = useState<ImageSource[]>([
    // require("@assets/images/test.jpg"),
    // require("@assets/images/test-1.jpg"),
    // require("@assets/images/test-2.jpg"),
  ]);

  const navigateToHand = () => {
    if (handImages != undefined) {
      navigation.dispatch(
        DrawerActions.jumpTo("Hand", { handImages: handImages })
      );
    }
  };

  useEffect(() => {
    if (userID) {
      fetchFileFromStorage(userID + "/profile.jpg", "profile_pics").then(
        (profilePic) => {
          setProfilePic(profilePic as ImageSource);
        }
      );
    }
  }, [userID]);

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
          source={profilePic}
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
            margin: 15,
          }}
          cachePolicy={"disk"}
        />
        <Pressable onPress={() => navigation.navigate("EditProfile")}>
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: "Inter-Regular",
              paddingVertical: 5,
              paddingHorizontal: 15,
              borderWidth: 1,
              borderColor: DARK_BORDER_COLOR,
              borderRadius: 2,
            }}
          >
            Edit Profile
          </Text>
        </Pressable>
        {handImages.length >= 1 ? (
          <HandPreview
            handImages={handImages}
            showHandCallback={navigateToHand}
          />
        ) : (
          <Text style={{ color: "#FFFFFF", margin: 30 }}>
            No cards in their hand yet!
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
