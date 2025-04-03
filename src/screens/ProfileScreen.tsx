import HandPreview from "@components/HandPreview";
import { fetchHands } from "@services/supabase/database/fetch";
import { fetchFileFromStorage } from "@services/supabase/storage/fetch";
import { selectUserID, selectUserProfilePic } from "@store/slices/user";
import { DARK_BG_COLOR, DARK_BORDER_COLOR } from "@theme/colors";
import { CARD_HEIGHT } from "@theme/card";
import { ProfileScreenProps } from "@ts/types/navigation";
import { DrawerActions } from "@react-navigation/native";
import { Image, ImageSource } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const userID = useSelector(selectUserID);
  const MAX_HAND_CARDS = useMemo<number>(() => 7, []);
  const ADD_CARD_KEY = useMemo<string>(() => "+", []);
  const profilePic = useSelector(selectUserProfilePic);

  const [handImages, setHandImages] = useState<ImageSource[]>([]);
  const [handDataKeys, setHandDataKeys] = useState<string[]>([]);

  const navigateToHand = () => {
    if (handImages != undefined) {
      navigation.dispatch(
        DrawerActions.jumpTo("Hand", { handImages: handImages })
      );
    }
  };

  useEffect(() => {
    const getHandImages = async () => {
      try {
        const numHandsResponse = await fetchHands(userID);
        if (numHandsResponse.error || numHandsResponse.data == null)
          throw numHandsResponse.error;
        else if (numHandsResponse.data.length > 0) {
          let newHandImages: ImageSource[] = [];
          let newHandDataKeys: string[] = [];
          for (let i = 1; i < MAX_HAND_CARDS + 1; i++) {
            console.log("i:", i);
            if (numHandsResponse.data[0][i.toString()] != null) {
              // `fetchFileFromStorage` has its own try-catch block
              const handImage = await fetchFileFromStorage(
                userID + "/" + numHandsResponse.data[0][i.toString()],
                "hands"
              );
              console.log("handImage != null:", handImage != null);
              if (handImage != null) {
                newHandImages.push(handImage as ImageSource);
                newHandDataKeys.push(numHandsResponse.data[0][i.toString()]);
              }
            }
          }
          setHandImages(newHandImages);
          setHandDataKeys(newHandDataKeys);
        }
      } catch (error: any) {
        console.error(error);
      }
    };

    if (userID != "") getHandImages();
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
        <Pressable
          onPress={() =>
            navigation.navigate("EditProfile", {
              handImages: handImages,
              handDataKeys: ["+"].concat(handDataKeys),
            })
          }
        >
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
