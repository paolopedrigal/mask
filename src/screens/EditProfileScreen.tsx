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
  setUsername,
} from "@redux/userSlice";
import { ImageSource } from "expo-image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
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
import ModalBinaryContent from "@components/ModalBinaryContent";
import { supabase } from "supabase";
import { v4 as uuid } from "uuid";
import { decode } from "base64-arraybuffer";
import ErrorMessage from "@components/ErrorMessage";
import { sleep } from "@utils/utils";

// TODO: Get typing for key, disabledDrag, and disabledReSorted from "react-native-draggable-grid"
interface HandData extends CardProps {
  key: string;
  disabledDrag?: boolean;
  disabledReSorted?: boolean;
}

export default function EditProfileScreen({
  route,
  navigation,
}: EditProfileProps) {
  const { handImages, handDataKeys } = route.params;
  const MAX_HAND_CARDS = useMemo<number>(() => 7, []);
  const ADD_CARD_KEY = useMemo<string>(() => "+", []);
  const userID = useSelector(selectUserID);
  const dispatch = useDispatch();
  const regexUsername = useMemo(() => /^[a-zA-Z._]+$/, []);

  /*********************** States ***********************/
  const profilePic = useSelector(selectUserProfilePic);
  const [newProfilePic, setNewProfilePic] = useState<{
    base64: string;
  }>();
  const username: string = useSelector(selectUsername);
  const [newUsername, setNewUsername] = useState<string>("");
  const favColor: string = useSelector(selectFavColor);
  // const [handDataKeys, setHandDataKeys] = useState<string[]>(["+"]);
  const [handData, setHandData] = useState<HandData[]>([
    {
      key: ADD_CARD_KEY,
      disabledDrag: true,
      disabledReSorted: true,
      authorID: userID,
    },
  ]);
  const [allowSave, setAllowSave] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isInvalidUsernameErrorVisible, setIsInvalidUsernameErrorVisible] =
    useState<boolean>(false);
  const [isUsernameTakenErrorVisible, setIsUsernameTakenErrorVisible] =
    useState<boolean>(false);
  /*********************** States END ***********************/

  /*********************** Refs ***********************/

  const newUsernameRef = useRef<string>("");
  const handDataRef = useRef<HandData[]>(handData);

  /*********************** Refs END ***********************/

  /*********************** Callbacks ***********************/

  const removeBase64ImagePrefix = useCallback((base64Str: string) => {
    // Check if the string starts with a valid Base64 image data URL prefix
    const prefixRegex = /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,/;
    if (prefixRegex.test(base64Str)) {
      // Remove the prefix part
      return base64Str.replace(prefixRegex, "");
    }
    // If no prefix is found, return the original string
    return base64Str;
  }, []);

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
      });
    }
  };

  const isNewHand = () => {
    if (handData != undefined && handDataKeys != undefined) {
      let i: number = 0;
      while (i < handData.length && i < handDataKeys.length) {
        if (handData[i].key != handDataKeys[i]) return true;
        i += 1;
      }
      return handData.length != handDataKeys.length;
    } else {
      return null;
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

    if (!result.canceled && result.assets[0].base64 != null) {
      const key = uuid();
      setHandData((prev) => {
        const newHandData = prev.slice();
        newHandData.splice(1, 0, {
          key: key,
          authorID: userID,
          image: ("data:image/jpeg;base64," +
            result.assets[0].base64) as ImageSource,
        });
        return newHandData;
      });
      setAllowSave(true);
    } else if (!result.canceled && result.assets[0].base64 == null) {
      console.error("Unable to get image");
    }
  };

  const deleteHandCard = (key: string) => {
    let newHandData: HandData[] = handData;
    // Add "+" card back to grid
    if (handData.length == MAX_HAND_CARDS && handData[0].key != "+") {
      newHandData.unshift({
        key: ADD_CARD_KEY,
        disabledDrag: true,
        disabledReSorted: true,
        authorID: userID,
      });
    }
    setHandData(newHandData.filter((handCard) => handCard.key != key));
  };

  const updateProfileChanges = async () => {
    let isSuccessfulUpload = true;
    try {
      if (allowSave) {
        // Update new username if desired (Note: If invalid new username, update doesn't continue)
        if (newUsernameRef.current != "") {
          if (!regexUsername.test(newUsernameRef.current)) {
            setIsInvalidUsernameErrorVisible(true);
            await sleep(2000);
            setIsInvalidUsernameErrorVisible(false);
            throw new Error();
          }
          const newUserNameUpdateResponse = await supabase
            .from("users")
            .update({ username: newUsernameRef.current })
            .eq("user_id", userID)
            .select();

          if (newUserNameUpdateResponse.error) {
            setIsUsernameTakenErrorVisible(true);
            await sleep(2000);
            setIsUsernameTakenErrorVisible(false);
            throw newUserNameUpdateResponse.error;
          }
        }

        // Upload profile picture
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

        // Upload new hand cards to storage and database
        if (isNewHand()) {
          let handKeysUpsertData: { [key: number]: string | null } = {};
          for (let i = 1; i < MAX_HAND_CARDS + 1; i++) {
            console.log(i);
            if (i < handDataRef.current.length) {
              const handPictureUploadResponse = await supabase.storage
                .from("hands")
                .upload(
                  userID + "/" + handDataRef.current[i].key,
                  decode(
                    removeBase64ImagePrefix(
                      handDataRef.current[i].image as string
                    )
                  ),
                  {
                    contentType: "image/jpeg",
                    upsert: true, // Overwrite previous profile pic if exists
                  }
                );
              if (handPictureUploadResponse.error)
                throw handPictureUploadResponse.error;

              handKeysUpsertData[i] = handDataRef.current[i].key;
            } else {
              handKeysUpsertData[i] = null;
            }
          }
          const handKeysInsertResponse = await supabase
            .from("hands")
            .upsert({
              user_id: userID,
              1: handKeysUpsertData[1],
              2: handKeysUpsertData[2],
              3: handKeysUpsertData[3],
              4: handKeysUpsertData[4],
              5: handKeysUpsertData[5],
              6: handKeysUpsertData[6],
              7: handKeysUpsertData[7],
            })
            .select();

          if (handKeysInsertResponse.error) throw handKeysInsertResponse.error;
          else {
            console.log("Uploaded pictures.");
          }
        }
      }
    } catch (error: any) {
      isSuccessfulUpload = false;
      // console.error("Error upon uploading changes:", error);
      // TODO: Show UI error message
    } finally {
      return isSuccessfulUpload;
    }
  };

  const save = async () => {
    console.log("saving...");

    // Dismiss keyboard if open
    Keyboard.dismiss();

    // Upload profile changes to Supabase
    const isSuccessfulUpload = await updateProfileChanges();

    if (isSuccessfulUpload) {
      if (newProfilePic != undefined) {
        dispatch(
          setUserProfilePic(
            ("data:image/jpeg;base64," + newProfilePic.base64) as ImageSource
          )
        );
      }
      if (newUsernameRef.current != "") {
        console.log("dispatching newUsername:", newUsernameRef.current);
        dispatch(setUsername(newUsernameRef.current));
      }
      reset();
      navigation.navigate("Profile"); // Included within `save` function because dependent on successful upload
    }
  };

  const reset = () => {
    setNewUsername("");
    setNewProfilePic(undefined);
    setAllowSave(false);
    Keyboard.dismiss();
  };

  /*********************** Callbacks END ***********************/

  /*********************** useEffect hook calls ***********************/
  useEffect(() => {
    for (let i = 0; i < handData.length; i++) {
      console.log(handData[i].key);
    }
    console.log("--------");
    handDataRef.current = handData;
  }, [handData]);

  useEffect(() => {
    if (handImages != undefined && handDataKeys != undefined) {
      const newHandData: HandData[] = [];
      for (let i = 0; i < handImages.length + 1; i++) {
        if (i == 0 && handImages.length != MAX_HAND_CARDS) {
          newHandData.push(handData[0]); // Pushing "+" card
        } else {
          newHandData.push({
            key: handDataKeys[i],
            authorID: userID,
            image: handImages[i - 1],
          });
        }
      }
      setHandData(newHandData);
    }
  }, []);

  useEffect(() => {
    newUsernameRef.current = newUsername;

    if (newProfilePic != undefined || newUsername != "" || isNewHand()) {
      setAllowSave(true);
    } else if (
      newProfilePic == undefined &&
      newUsername == "" &&
      !isNewHand()
    ) {
      setAllowSave(false);
    }
  }, [newProfilePic, newUsername, handData]);

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
          <ModalBinaryContent
            title={"Unsaved changes"}
            leftText={"Keep editing"}
            leftCallback={() => setIsModalVisible(false)}
            rightText={"Leave"}
            rightCallback={() => {
              reset();
              setIsModalVisible(false);
              navigation.navigate("Profile");
            }}
          />
        </Modal>
        <Modal isVisible={isInvalidUsernameErrorVisible} hasBackdrop={false}>
          <ErrorMessage message={"Invalid username."} />
        </Modal>
        <Modal isVisible={isUsernameTakenErrorVisible} hasBackdrop={false}>
          <ErrorMessage message={"Username taken."} />
        </Modal>

        <View>
          <Image
            source={
              newProfilePic != undefined
                ? "data:image/jpeg;base64," + newProfilePic.base64
                : profilePic
            }
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
          if (item.key == ADD_CARD_KEY) {
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
                <Card image={item.image as ImageSource} scalar={0.5} />
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
