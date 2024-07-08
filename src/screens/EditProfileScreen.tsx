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
  selectUserID,
  selectUserProfilePic,
  selectUsername,
  setUserProfilePic,
} from "@redux/userSlice";
import { ImageSource } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "expo-image";
import { HeaderBackButton } from "@react-navigation/elements";
import { CardProps } from "@_types/CardTypes";
import Card from "@components/Card";
import DraggableGrid from "react-native-draggable-grid";
import { EditProfileProps } from "@_types/NavigationTypes";
import * as ExpoImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native";
import ModalContent from "@components/ModalContent";
import { supabase } from "supabase";
import { decode } from "base64-arraybuffer";

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
  const MAX_HAND_CARDS = useMemo<number>(() => 7, []);
  const userID = useSelector(selectUserID);
  const dispatch = useDispatch();

  /*********************** States ***********************/
  const [profilePic, setProfilePic] = useState<ImageSource>(
    useSelector(selectUserProfilePic)
  );
  const [newProfilePic, setNewProfilePic] = useState<{
    base64: string;
    uri: string;
  }>();
  const username: string = useSelector(selectUsername);
  const [newUsername, setNewUsername] = useState<string>("");
  const favColor: string = useSelector(selectFavColor);
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
  ]);
  const [allowSave, setAllowSave] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  /*********************** States END ***********************/

  /*********************** Callbacks ***********************/

  const pickProfilePic = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].base64 != null) {
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
      // Recreate hand data cards state
      const prevHandData: HandData[] = handData;
      const newHandData: HandData[] = [];
      for (let i = 0; i < prevHandData.length + 1; i++) {
        if (i == 0 && prevHandData.length != MAX_HAND_CARDS) {
          newHandData.push(prevHandData[i]); // Pushing "+" card
        } else if (i == 1) {
          newHandData.push({
            key: "1",
            authorID: "1",
            authorText: "",
            isAuthorBold: false,
            hasAuthorImage: false,
            image: result.assets[0].uri as ImageSource,
          });
        } else if (i > 1) {
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
      setAllowSave(true);
    }
  };

  const deleteHandCard = (key: string) => {
    let newHandData: HandData[] = handData;
    // Add "+" card back to grid
    if (handData.length == MAX_HAND_CARDS && handData[0].key != "0") {
      newHandData.unshift({
        key: "0",
        disabledDrag: true,
        disabledReSorted: true,
        authorID: "1",
        authorText: "",
        isAuthorBold: false,
        hasAuthorImage: false,
      });
    }
    setHandData(newHandData.filter((handCard) => handCard.key != key));
  };

  const uploadProfileChanges = async () => {
    let isSuccessfulUpload = true;
    try {
      if (allowSave) {
        if (newProfilePic != undefined) {
          const imageURL = userID + "/" + "profile.jpg";
          const profilePicInsertResponse = await supabase.storage
            .from("profile_pics")
            .upload(imageURL, decode(newProfilePic.base64), {
              contentType: "image/jpeg",
              upsert: true, // Overwrite previous profile pic if exists
            });
          if (profilePicInsertResponse.error)
            throw profilePicInsertResponse.error;
        }
      }
    } catch (error: any) {
      isSuccessfulUpload = false;
      console.error("Error upon uploading changes:", error);
      // TODO: Show UI error message
    } finally {
      return isSuccessfulUpload;
    }
  };

  const save = async () => {
    const isSuccessfulUpload = await uploadProfileChanges();
    if (isSuccessfulUpload) {
      if (newProfilePic != undefined) {
        dispatch(setUserProfilePic(newProfilePic.uri as ImageSource));
      }
      navigation.navigate("Profile");
    }
  };

  /*********************** Callbacks END ***********************/

  /*********************** useEffect hook calls ***********************/

  useEffect(() => {
    for (let i = 0; i < handData.length; i++) {
      console.log(handData[i].key);
    }
    console.log("--------");
  }, [handData]);

  useEffect(() => {
    // Dynamically change header of screen to include `postDeck` callback function
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            if (allowSave) {
              setIsModalVisible(true);
            } else navigation.navigate("Profile");
          }}
          labelVisible={false}
          tintColor="#A9A9A9"
          style={{
            padding: 20,
          }}
        />
      ),
      headerRight: () => (
        <Pressable
          onPress={save}
          style={{
            backgroundColor: allowSave ? "#FFFFFF" : PRESSABLE_FADED_BG_COLOR,
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
  }, [allowSave]);

  useEffect(() => {
    if (newProfilePic != undefined || newUsername != "") {
      setAllowSave(true);
    } else if (newProfilePic == undefined && newUsername == "") {
      setAllowSave(false);
    }
  }, [newProfilePic, newUsername]);

  /******************** useEffect hook calls END *************************/

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
        <Modal
          isVisible={isModalVisible}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <ModalContent
            title={"Unsaved changes"}
            leftText={"Keep editing"}
            leftCallback={() => setIsModalVisible(false)}
            rightText={"Leave"}
            rightCallback={() => console.log("testing")}
          />
        </Modal>
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
            width: "100%",
            marginVertical: 10,
            borderBottomWidth: 1,
            borderColor: DARK_BORDER_COLOR,
            paddingVertical: 12,
            paddingHorizontal: 25,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF" }}>Card Color</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 40 }}>
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
                  backgroundColor: "transparent",
                  borderColor: DARK_BORDER_COLOR,
                  borderWidth: 0.8,
                  width: 0.5 * CARD_WIDTH,
                  height: 0.5 * CARD_HEIGHT,
                  borderRadius: 0.5 * CARD_BORDER_RADIUS,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  if (handData.length < MAX_HAND_CARDS + 1) pickHandImage(); // + 1 for the "+" card
                }}
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
                <Pressable
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    zIndex: 2,
                  }}
                  onPress={() => {
                    console.log("Delete item:", item.key);
                    deleteHandCard(item.key);
                  }}
                >
                  <Image
                    source={require("@assets/icons/minus-icon.jpg")}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 100,
                    }}
                  />
                </Pressable>
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
          setAllowSave(true);
        }}
      />
    </ScrollView>
  );
}
