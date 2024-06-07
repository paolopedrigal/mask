import React, {
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect,
} from "react";
import { StyleSheet, View, Pressable } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import Deck from "@components/Deck";
import {
  BOTTOM_SHEET_BG_COLOR,
  BOTTOM_SHEET_HANDLE_INDICATOR_COLOR,
  DARK_BG_COLOR,
} from "@assets/styles/colors";
import { CARD_BORDER_RADIUS } from "@assets/styles/card";
import Card from "@components/Card";
import { CardProps } from "@_types/CardTypes";
import { supabase } from "supabase";
import { useSelector } from "react-redux";
import { selectUserID } from "@redux/userSlice";
import { fetchFileFromStorage } from "@utils/supabase-utils";
import { ImageSource } from "expo-image";

interface InboxInterface {
  id: string;
  card: CardProps;
}

export default function HomeScreen() {
  const sheetRef = useRef<BottomSheet>(null);
  const [deckID, setDeckID] = useState<string>("");
  const snapPoints = useMemo(() => ["5%", "100%"], []);
  const userID = useSelector(selectUserID);
  const [inbox, setInbox] = useState<InboxInterface[]>([]);

  // callbacks
  const handleClosePress = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);

  useEffect(() => {
    async function fetchInbox() {
      interface InboxQuery {
        deck_id: string;
        viewed: boolean;
        main_card_id: { text: string | null; image_url: string | null };
        sender_id: { user_id: string; username: string; fav_color: string };
      }

      try {
        const { data, error } = await supabase
          .from("inbox")
          .select(
            `
            deck_id,
            viewed,
            main_card_id (
              text,
              image_url
            ),
            sender_id (
              user_id,
              username,
              fav_color
            )
          `
          )
          .eq("recipient_id", userID)
          .returns<InboxQuery[]>();

        if (error) throw error;
        else {
          let inboxArray: InboxInterface[] = [];
          for (let i: number = 0; i < data.length; i++) {
            let cardPic = undefined;

            if (data[i].main_card_id.image_url != undefined) {
              cardPic = await fetchFileFromStorage(
                data[i].main_card_id.image_url as string,
                "card_pics"
              );
            }

            inboxArray.push({
              id: data[i].deck_id,
              card: {
                authorID: data[i].sender_id.user_id,
                text: data[i].main_card_id?.text,
                image: cardPic as ImageSource,
                authorText: data[i]?.sender_id.username,
                isHidden: false, //!data[0]["viewed"],
                hasAuthorImage: true,
                backgroundColor: data[i].sender_id.fav_color,
                isAuthorBold: false,
              },
            });
          }

          setInbox(inboxArray);
        }
      } catch (error: any) {
        console.error("error in home screen:", error.message);
      }
    }
    if (userID) fetchInbox();
  }, [userID]);

  return (
    <View style={styles.container}>
      <Deck deckID={deckID} />
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        handleStyle={{
          backgroundColor: BOTTOM_SHEET_BG_COLOR,
          borderTopLeftRadius: CARD_BORDER_RADIUS,
          borderTopRightRadius: CARD_BORDER_RADIUS,
        }}
        handleIndicatorStyle={{
          backgroundColor: BOTTOM_SHEET_HANDLE_INDICATOR_COLOR,
        }}
        backgroundStyle={{
          backgroundColor: BOTTOM_SHEET_BG_COLOR,
        }}
      >
        <BottomSheetFlatList
          data={inbox}
          // keyExtractor={(i) => i}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setDeckID(item.id);
                handleClosePress();
              }}
              style={{ margin: 5 }}
            >
              <Card
                image={item.card.image}
                authorID={item.card.authorID}
                text={item.card.text}
                authorText={""}
                isAuthorBold={item.card.isAuthorBold}
                hasAuthorImage={item.card.hasAuthorImage}
                backgroundColor={item.card.backgroundColor}
                paddingBottom={15}
                scalar={0.5}
                isHidden={item.card.isHidden}
              />
            </Pressable>
          )}
          contentContainerStyle={styles.contentContainer}
          horizontal={false}
          key={"_"}
          numColumns={2}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
    backgroundColor: DARK_BG_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    backgroundColor: BOTTOM_SHEET_BG_COLOR,
    alignItems: "center",
    padding: 5,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});
