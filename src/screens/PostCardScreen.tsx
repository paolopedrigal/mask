import { PostCardScreenProps } from "@_types/NavigationTypes";
import {
  DARK_BG_COLOR,
  DARK_BORDER_COLOR,
  INNER_VIEW_DARK_BG_COLOR,
  LOW_LUMINANCE_FADED_TEXT_COLOR,
  LOW_LUMINANCE_TEXT_COLOR,
  POST_CARD_VISIBILITY_TEXT_COLOR,
  SELECTION_COLOR,
} from "@assets/styles/colors";
import { Pressable, Switch, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { FlatList } from "react-native-gesture-handler";
import PostCardFriendListItem from "@components/PostCardFriendListItem";
import { useEffect, useState } from "react";
import { FriendsInterface, selectFriendsData } from "@redux/userSlice";
import { useSelector } from "react-redux";

interface SelectedFriendsInterface {
  [key: string]: boolean;
}

export default function PostCardScreen({
  navigation,
  route,
}: PostCardScreenProps) {
  const [visibility, setVisibility] = useState<
    "anonymous" | "private" | "mutuals"
  >("mutuals");
  const friendsData: FriendsInterface = useSelector(selectFriendsData);
  const [isCardsBurned, setIsCardBurned] = useState<boolean>(false);
  const [selectedFriends, setSelectedFriends] =
    useState<SelectedFriendsInterface>();
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

  const toggleBurnSwitch = () => {
    setIsCardBurned((prev) => !prev);
  };

  const selectFriend = (friendID: string) => {
    setSelectedFriends((prev) => {
      if (prev) return { ...prev, [friendID]: !prev[friendID] };
    });
  };

  const selectAllFriends = () => {
    let selectAllFriendsState: SelectedFriendsInterface = {};
    const friendsIDs = Object.keys(friendsData);
    for (let i = 0; i < friendsIDs.length; i++) {
      selectAllFriendsState[friendsIDs[i]] = true;
    }
    setSelectedFriends(selectAllFriendsState);
    setIsSelectAll(true);
  };

  const unselectAllFriends = () => {
    let selectAllFriendsState: SelectedFriendsInterface = {};
    const friendsIDs = Object.keys(friendsData);
    for (let i = 0; i < friendsIDs.length; i++) {
      selectAllFriendsState[friendsIDs[i]] = false;
    }
    setSelectedFriends(selectAllFriendsState);
    setIsSelectAll(false);
  };

  const isAllFriendsSelected = () => {
    const friendsIDs = Object.keys(friendsData);
    if (selectedFriends == undefined) return false;
    for (let i = 0; i < friendsIDs.length; i++) {
      if (selectedFriends && !selectedFriends[friendsIDs[i]]) return false;
    }
    return true;
  };

  useEffect(unselectAllFriends, []);

  useEffect(() => {
    if (isAllFriendsSelected()) setIsSelectAll(true);
    else setIsSelectAll(false);
  }, [selectedFriends]);

  return (
    <View style={{ flex: 1, backgroundColor: DARK_BG_COLOR, padding: 10 }}>
      <View>
        <Text
          style={{
            color: LOW_LUMINANCE_TEXT_COLOR,
            fontFamily: "Inter-Regular",
            fontSize: 16,
            paddingVertical: 10,
            marginLeft: 15,
          }}
        >
          Deck Settings
        </Text>
        <View
          style={{
            backgroundColor: INNER_VIEW_DARK_BG_COLOR,
            height: 120,
            padding: 20,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 30,
            }}
          >
            <Text
              style={{
                color: LOW_LUMINANCE_TEXT_COLOR,
                fontFamily: "Inter-Bold",
              }}
            >
              Visibility
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "70%",
              }}
            >
              <Pressable onPress={() => setVisibility("anonymous")}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    paddingBottom: 5,
                    borderColor:
                      visibility == "anonymous"
                        ? POST_CARD_VISIBILITY_TEXT_COLOR
                        : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color:
                        visibility == "anonymous"
                          ? POST_CARD_VISIBILITY_TEXT_COLOR
                          : LOW_LUMINANCE_TEXT_COLOR,
                      fontSize: 14,
                      fontFamily: "Inter-Regular",
                    }}
                  >
                    Anonymous
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={() => setVisibility("private")}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    paddingBottom: 5,
                    borderColor:
                      visibility == "private"
                        ? POST_CARD_VISIBILITY_TEXT_COLOR
                        : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color:
                        visibility == "private"
                          ? POST_CARD_VISIBILITY_TEXT_COLOR
                          : LOW_LUMINANCE_TEXT_COLOR,
                      fontSize: 14,
                      fontFamily: "Inter-Regular",
                    }}
                  >
                    Private
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={() => setVisibility("mutuals")}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    paddingBottom: 5,
                    borderColor:
                      visibility == "mutuals"
                        ? POST_CARD_VISIBILITY_TEXT_COLOR
                        : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color:
                        visibility == "mutuals"
                          ? POST_CARD_VISIBILITY_TEXT_COLOR
                          : LOW_LUMINANCE_TEXT_COLOR,
                      fontSize: 14,
                      fontFamily: "Inter-Regular",
                    }}
                  >
                    Mutuals
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: LOW_LUMINANCE_TEXT_COLOR,
                  fontFamily: "Inter-Bold",
                }}
              >
                Burn Cards Upon Swipe
              </Text>
            </View>
            <Switch
              onValueChange={toggleBurnSwitch}
              value={isCardsBurned}
              trackColor={{ true: POST_CARD_VISIBILITY_TEXT_COLOR }}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          marginVertical: 10,
        }}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: DARK_BORDER_COLOR,
            flex: 1,
            borderRadius: 25,
            height: 30,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <Image
            source={require("@assets/icons/search-icon.png")}
            style={{ width: 20, height: 20, marginRight: 5 }}
          />
          <TextInput
            placeholder="Search a friend"
            placeholderTextColor={LOW_LUMINANCE_FADED_TEXT_COLOR}
            selectionColor={SELECTION_COLOR}
            style={{ color: LOW_LUMINANCE_TEXT_COLOR, width: "85%" }}
          />
        </View>
        <View
          style={{
            width: 100,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Pressable
            onPress={isSelectAll ? unselectAllFriends : selectAllFriends}
          >
            <Text
              style={{
                color: LOW_LUMINANCE_TEXT_COLOR,
                fontFamily: "Inter-Regular",
                fontSize: 15,
              }}
            >
              {isSelectAll ? "Unselect All" : "Select All"}
            </Text>
          </Pressable>
        </View>
      </View>
      <View
        style={{
          backgroundColor: INNER_VIEW_DARK_BG_COLOR,
          flex: 1,
          borderRadius: 15,
        }}
      >
        <FlatList
          data={Object.keys(friendsData).map((friendID) => ({
            friendID: friendID,
            username: friendsData[friendID]["username"],
          }))}
          renderItem={({ item }) => (
            <PostCardFriendListItem
              friendID={item.friendID}
              friendUsername={item.username}
              selectItemCallback={selectFriend}
              selectedFriends={selectedFriends}
            />
          )}
          style={{ paddingVertical: 5 }}
        />
      </View>
    </View>
  );
}
