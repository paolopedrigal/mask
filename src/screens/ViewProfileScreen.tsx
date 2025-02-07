import HandPreview from "@components/HandPreview";
import { fetchFileFromStorage } from "@services/supabase/storage";
import { selectUserID } from "@store/slices/user";
import { DARK_BG_COLOR } from "@theme/colors";
import { CARD_HEIGHT } from "@theme/card";
import { ViewProfileScreenProps } from "@ts/types/navigation";
import { DrawerActions } from "@react-navigation/native";
import { Image, ImageSource } from "expo-image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ScrollView, Text, View } from "react-native";

export default function ProfileScreen({ navigation }: ViewProfileScreenProps) {
  const userID = useSelector(selectUserID);
  const [profilePic, setProfilePic] = useState<ImageSource>();
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
        {handImages.length >= 1 && (
          <HandPreview
            handImages={handImages}
            showHandCallback={navigateToHand}
          />
        )}
      </View>
    </ScrollView>
  );
}
