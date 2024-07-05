import {
  CARD_BORDER_RADIUS,
  CARD_HEIGHT,
  CARD_WIDTH,
} from "@assets/styles/card";
import {
  DARK_BG_COLOR,
  DARK_BORDER_COLOR,
  ICON_GRAY_OUTLINE_COLOR,
  LOW_LUMINANCE_FADED_TEXT_COLOR,
  PRESSABLE_FADED_BG_COLOR,
} from "@assets/styles/colors";
import {
  selectFavColor,
  selectUserProfilePic,
  selectUsername,
} from "@redux/userSlice";
import { ImageSource } from "expo-image";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { Image } from "expo-image";
import { HeaderBackButton } from "@react-navigation/elements";
import { CardProps } from "@_types/CardTypes";
import Card from "@components/Card";
import DraggableGrid from "react-native-draggable-grid";
import { EditProfileProps } from "@_types/NavigationTypes";
import * as ExpoImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native";

interface HandData extends CardProps {
  key: string;
  disabledDrag?: boolean;
  disabledReSorted?: boolean;
}

// Not commiting these temp pictures
// require("@assets/images/test.jpg"),
// require("@assets/images/test-1.jpg"),
// require("@assets/images/test-2.jpg"),

export default function EditProfileScreen({ navigation }: EditProfileProps) {
  const [profilePic, setProfilePic] = useState<ImageSource>(
    useSelector(selectUserProfilePic)
  );
  const [newProfilePic, setNewProfilePic] = useState<{
    base64?: string | null;
    uri?: string | null;
  }>();
  const [username, setUsername] = useState<string>(useSelector(selectUsername));
  const [newUsername, setNewUsername] = useState<string>("");
  const [favColor, setFavColor] = useState<string>(useSelector(selectFavColor));
  const [handData, setHandData] = useState<HandData[]>([
    {
      key: "0",
      disabledDrag: true,
      disabledReSorted: true,
      authorID: "1",
      authorText: "",
      isAuthorBold: false,
      hasAuthorImage: false,
    },
    {
      key: "1",
      authorID: "1",
      authorText: "",
      isAuthorBold: false,
      hasAuthorImage: false,
      image: require("@assets/images/test.jpg"),
    },
    {
      key: "2",
      authorID: "1",
      authorText: "",
      isAuthorBold: false,
      hasAuthorImage: false,
      image: require("@assets/images/test-1.jpg"),
    },
    {
      key: "3",
      authorID: "1",
      authorText: "",
      isAuthorBold: false,
      hasAuthorImage: false,
      image: require("@assets/images/test-2.jpg"),
    },
    // {
    //   key: "4",
    //   authorID: "1",
    //   authorText: "",
    //   isAuthorBold: false,
    //   hasAuthorImage: false,
    //   image: require("@assets/images/test-2.jpg"),
    // },
    // {
    //   key: "5",
    //   authorID: "1",
    //   authorText: "",
    //   isAuthorBold: false,
    //   hasAuthorImage: false,
    //   image: require("@assets/images/test-2.jpg"),
    // },
    // {
    //   key: "6",
    //   authorID: "1",
    //   authorText: "",
    //   isAuthorBold: false,
    //   hasAuthorImage: false,
    //   image: require("@assets/images/test-2.jpg"),
    // },
  ]);

  const pickProfilePic = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewProfilePic({
        base64: result.assets[0].base64,
        uri: result.assets[0].uri,
      });
      setProfilePic(result.assets[0].uri as ImageSource);
    }
  };

  const pickHandImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const prevHandData: HandData[] = handData;
      const newHandData: HandData[] = [];
      for (let i = 0; i < prevHandData.length + 1; i++) {
        if (i == 0) {
          newHandData.push(prevHandData[i]);
        } else if (i == 1) {
          newHandData.push({
            key: "1",
            authorID: "1",
            authorText: "",
            isAuthorBold: false,
            hasAuthorImage: false,
            image: result.assets[0].uri as ImageSource,
          });
        } else {
          newHandData.push({
            key: i.toString(),
            authorID: "1",
            authorText: "",
            isAuthorBold: false,
            hasAuthorImage: false,
            image: prevHandData[i - 1].image,
          });
        }
      }
      setHandData(newHandData);
    }
  };

  useEffect(() => {
    // Dynamically change header of screen to include `postDeck` callback function
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => console.log("Updating changes to profile")}
          style={{
            backgroundColor: PRESSABLE_FADED_BG_COLOR,
            paddingVertical: 7,
            paddingHorizontal: 12,
            borderRadius: 5,
            marginHorizontal: 15,
          }}
        >
          <Text
            style={{
              color: "#000000",
              fontFamily: "Inter-Regular",
              fontSize: 13,
            }}
          >
            Save
          </Text>
        </Pressable>
      ),
    });
  }, []);

  return (
    <ScrollView
      style={{
        backgroundColor: DARK_BG_COLOR,
        flex: 1,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View>
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
          <Pressable onPress={pickProfilePic}>
            <Image
              source={require("@assets/icons/edit-pfp-icon.jpg")}
              style={{
                position: "absolute",
                right: 0,
                bottom: 20,
                width: 30,
                height: 30,
                borderRadius: 5,
              }}
            />
          </Pressable>
        </View>
        <TextInput
          placeholder={username}
          placeholderTextColor={LOW_LUMINANCE_FADED_TEXT_COLOR}
          value={newUsername}
          onChangeText={setNewUsername}
          style={{
            color: "#FFFFFF",
            borderBottomColor: "#FFFFFF",
            borderBottomWidth: 1,
            padding: 5,
            fontFamily: "Inter-Regular",
            fontSize: 16,
            width: 200,
            textAlign: "center",
          }}
        />
        <Pressable
          style={{
            marginVertical: 20,
            width: "100%",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: DARK_BORDER_COLOR,
            paddingVertical: 15,
            paddingHorizontal: 30,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF" }}>Card Color</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 30 }}>
            <View
              style={{
                backgroundColor: favColor,
                width: 20,
                height: 20,
                borderRadius: 100,
              }}
            />
            <HeaderBackButton
              labelVisible={false}
              tintColor={ICON_GRAY_OUTLINE_COLOR}
              style={{
                width: 20,
                height: 20,
                transform: [
                  { scaleX: -1 }, //horizontal
                ],
              }}
            />
          </View>
        </Pressable>
      </View>
      <DraggableGrid
        style={{ height: 2000 }}
        numColumns={2}
        itemHeight={260}
        data={handData}
        renderItem={(item) => {
          if (item.key == "0") {
            return (
              <TouchableOpacity
                key={item.key}
                style={{
                  backgroundColor: "#18183C",
                  width: 0.5 * CARD_WIDTH,
                  height: 0.5 * CARD_HEIGHT,
                  borderRadius: 0.5 * CARD_BORDER_RADIUS,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={pickHandImage}
              >
                <Image
                  source={require("@assets/icons/plus-sign-icon.jpg")}
                  style={{
                    width: 17,
                    height: 17,
                  }}
                />
              </TouchableOpacity>
            );
          } else {
            return (
              <View key={item.key}>
                <Card
                  authorText={""}
                  isAuthorBold={false}
                  hasAuthorImage={false}
                  image={item.image}
                  scalar={0.5}
                />
              </View>
            );
          }
        }}
        onDragRelease={(handData) => {
          setHandData(handData); // need reset the props data sort after drag release
        }}
      />
    </ScrollView>
  );
}
