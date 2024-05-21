import {
  AUTHOR_IMAGE_BORDER_COLOR,
  DARK_BORDER_COLOR,
  HIGH_LUMINANCE_TEXT_COLOR,
  LOW_LUMINANCE_FADED_TEXT_COLOR,
  LOW_LUMINANCE_TEXT_COLOR,
} from "@assets/styles/colors";
import { Image, ImageSource } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { supabase } from "supabase";

interface SelectedFriendsInterface {
  [key: string]: boolean;
}

interface PostCardFriendListItemProps {
  friendID: string;
  friendUsername: string;
  selectedFriends: SelectedFriendsInterface | undefined;
  selectItemCallback: (friendID: string) => void;
}

export default function PostCardFriendListItem(
  props: PostCardFriendListItemProps
) {
  const { friendID, friendUsername, selectedFriends, selectItemCallback } =
    props;
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<ImageSource>();

  useEffect(() => {
    if (selectedFriends) {
      if (selectedFriends[friendID]) setIsClicked(true);
      else setIsClicked(false);
    }
  }, [selectedFriends]);

  useEffect(() => {
    const fetchProfilePicFromStorage = async (): Promise<
      string | ArrayBuffer | null
    > => {
      try {
        const { data, error } = await supabase.storage
          .from("profile_pics")
          .download(friendID + "/profile.jpg");
        if (error) throw error;
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(data);
          fileReader.onloadend = () => {
            resolve(fileReader.result);
          };
          fileReader.onerror = (err) => {
            reject(err);
          };
        });
      } catch (error: any) {
        const defaultProfilePic: ImageSource = require("@assets/images/default-profile-pic.png");
        setProfilePic(defaultProfilePic);
        return null;
      }
    };
    fetchProfilePicFromStorage().then((profilePic) => {
      if (profilePic != null) setProfilePic(profilePic as ImageSource);
    });
  }, []);

  const toggleClicked = () => {
    setIsClicked((prev) => !prev);
  };

  return (
    <Pressable
      onPress={() => {
        toggleClicked();
        selectItemCallback(friendID);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          height: 60,
          width: "100%",
          borderBottomWidth: 1,
          borderBottomColor: DARK_BORDER_COLOR,
          paddingLeft: 25,
          paddingRight: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 15,
          }}
        >
          <Image
            source={
              profilePic != undefined
                ? profilePic
                : require("@assets/images/default-profile-pic.png")
            }
            style={{
              width: 30,
              height: 30,
              borderWidth: 0.5,
              borderColor: AUTHOR_IMAGE_BORDER_COLOR,
              borderRadius: 100,
            }}
          />
          <Text
            style={{
              color: isClicked
                ? LOW_LUMINANCE_TEXT_COLOR
                : HIGH_LUMINANCE_TEXT_COLOR,
              fontFamily: "Inter-Regular",
            }}
          >
            {friendUsername}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            height: "100%",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingRight: 25,
          }}
        >
          {isClicked ? (
            <Image
              source={require("@assets/icons/check-icon.png")}
              style={{ width: 20, height: 20 }}
            />
          ) : (
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 100,
                backgroundColor: "#1C1D23",
                borderWidth: 1,
                borderColor: "#282B33",
              }}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}
