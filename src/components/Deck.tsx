import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image, ImageSource } from "expo-image";
import Card from "@components/Card";
import Swiper from "react-native-deck-swiper";
import { useEffect, useRef, useState } from "react";
import FlippingCard from "@components/FlippingCard";
import CommentCard from "@components/CommentCard";
import { DARK_BG_COLOR } from "@assets/styles/colors";
import { DeckCardData, DeckData, DeckProps } from "@_types/DeckTypes";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "supabase";
import { useSelector } from "react-redux";
import {
  FriendsInterface,
  selectFriendsData,
  selectUserID,
} from "@redux/userSlice";
import { fetchFileFromStorage } from "@utils/supabase-utils";
import { useNavigation } from "@react-navigation/native";
import { HomeProps } from "@_types/NavigationTypes";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  card: {
    flex: 1,
    width: "100%",
    height: 500,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent",
  },
  smallerTouchablePadding: {
    paddingHorizontal: 5,
  },
  biggerTouchablePadding: {
    paddingHorizontal: 10,
  },
});

export default function Deck(props: DeckProps) {
  const { deckID }: DeckProps = props;
  const [userID, setUserID] = useState<string>(useSelector(selectUserID)); // Get current user's ID
  const [friendsData, setFriendsData] = useState<FriendsInterface>(
    useSelector(selectFriendsData)
  ); // Get current user's friends' IDs
  const [deck, setDeck] = useState<DeckData>(); // Deck data
  const [deckLength, setDeckLength] = useState<number>(0);
  const [replied, setReplied] = useState<boolean>(false);
  const [allowedSwiping, setAllowedSwiping] = useState<boolean>(true);

  const homeNavigation = useNavigation<HomeProps["navigation"]>();

  const swiper = useRef<Swiper<DeckCardData>>(null);
  const swipeBackCallBack = () => {
    if (swiper.current && allowedSwiping) {
      swiper.current.swipeBack();
    }
  };
  const swipeForwardCallBack = () => {
    if (swiper.current && allowedSwiping) {
      swiper.current.swipeRight();
    }
  };

  // useEffect(() => {
  //   if (isSwipeButtonDisabled) {
  //     setTimeout(() => {
  //       console.log("Testing timeout");
  //       setIsSwipeButtonDisabled((prevState) => !prevState);
  //     }, 2000);
  //   }
  // }, [isSwipeButtonDisabled]);

  useEffect(() => {
    console.log("deckID:", deckID);

    const fetchDeck = async () => {
      try {
        interface FetchDeck {
          is_main: boolean;
          card_id: {
            card_id: string;
            author_id: {
              user_id: string;
              username: string;
              fav_color: string;
            };
            text: string | null;
            image_url: string | null;
          };
          deck_id: {
            view_mutuals: boolean;
            is_looping: boolean;
          };
        }

        console.log("deckID in fetchDeck:", deckID);

        const { data, error } = await supabase
          .from("replies")
          .select(
            `
              is_main,
              card_id (
                card_id,
                author_id (
                  user_id,
                  username,
                  fav_color
                ),
                text,
                image_url
              ),
              deck_id (
                view_mutuals,
                is_looping
              )
            `
          )
          .eq("deck_id", deckID)
          .returns<FetchDeck[]>();

        if (error) throw error;
        let deckCardsData: DeckCardData[] = [...Array(data.length)];
        let cardIndex: number = 1; // To let main card to be first index in array

        for (let i: number = 0; i < data.length; i++) {
          let cardPic = undefined;
          if (data[i].card_id.image_url != null) {
            // Fetch photo
            cardPic = await fetchFileFromStorage(
              data[i].card_id.image_url as string,
              "card_pics"
            );
            // cardPictures[data[i].card_id.card_id] = cardPic as ImageSource;
          }

          if (data[i].card_id.author_id.user_id == userID) setReplied(true);

          if (data[i].is_main)
            // Let main card be first index in array
            deckCardsData[0] = {
              cardID: data[i].card_id.card_id,
              authorID: data[i].card_id.author_id.user_id,
              isMain: data[i].is_main,
              card: {
                authorID: data[i].card_id.author_id.user_id,
                backgroundColor: data[i].card_id.author_id.fav_color,
                text: data[i].card_id.text,
                image: cardPic as ImageSource,
                authorText: data[i].card_id.author_id.username,
                isAuthorBold: true,
                hasAuthorImage: true,
              },
              comments: [],
            };
          else {
            deckCardsData[cardIndex] = {
              cardID: data[i].card_id.card_id,
              authorID: data[i].card_id.author_id.user_id,
              isMain: data[i].is_main,
              card: {
                authorID: data[i].card_id.author_id.user_id,
                backgroundColor: data[i].card_id.author_id.fav_color,
                text: data[i].card_id.text,
                image: cardPic as ImageSource,
                authorText: data[i].card_id.author_id.username,
                isAuthorBold: false,
                hasAuthorImage: true,
              },
              comments: [],
            };
            cardIndex++;
          }
        }

        const viewMutuals = data[0].deck_id.view_mutuals;
        const numCards: number = viewMutuals
          ? deckCardsData.length
          : deckCardsData.filter(
              (cardData) => cardData.authorID == userID || cardData.isMain
            ).length; // Number of cards in deck depends if main user can see other mutuals in deck or not
        const isLooping = data[0].deck_id.is_looping;

        /*
         * No swiping activated:
         *  a) is_looping and only 1 card left OR
         *  b) !is_looping and no cards left (See `onSwipedAll` prop)
         */

        // Only 1 card in deck
        if (numCards == 1 && isLooping) {
          console.log("setting no swiping to true");
          setAllowedSwiping(false);
        } else {
          console.log("numCards:", numCards);
          setAllowedSwiping(true);
        }

        setDeck({
          deckCardsData: viewMutuals
            ? deckCardsData
            : deckCardsData.filter(
                (cardData) => cardData.authorID == userID || cardData.isMain
              ),
          isLooping: isLooping,
          viewMutuals: viewMutuals,
        });
        setDeckLength(numCards);
      } catch (error: any) {
        console.error("Error in fetchDeck:", error.message);
      }
    };

    if (deckID) fetchDeck();
  }, [deckID]);

  useEffect(() => {
    console.log("deckLength:", deckLength);
  }, [deckLength]);

  if (!deck || deckLength <= 0)
    return <Text style={{ color: "white" }}>No deck selected</Text>;
  // <View style={{ backgroundColor: DARK_BG_COLOR, flex: 1 }}></View>;
  else {
    return (
      <Swiper
        key={deck.deckCardsData.length} // key has to be length of `cards` to have dynamic size in `cards`
        ref={swiper}
        cards={deck.deckCardsData}
        renderCard={(cardData) => {
          if (cardData.isMain) {
            // show main card
            return (
              <Card
                key={cardData.cardID}
                authorID={cardData.authorID}
                backgroundColor={cardData.card.backgroundColor}
                text={cardData.card?.text}
                image={cardData.card?.image}
                authorText={cardData.card.authorText}
                hasAuthorImage={cardData.card.hasAuthorImage}
                isAuthorBold={cardData.card.isAuthorBold}
                isHidden={false}
              />
            );
          } else if (deck.viewMutuals) {
            // if viewing mutuals is allowed
            if (!replied || (replied && !(cardData.authorID in friendsData)))
              // show hidden cards
              return (
                <Card
                  key={cardData?.cardID}
                  authorID={cardData.authorID}
                  backgroundColor={cardData?.card.backgroundColor}
                  text={cardData?.card.text}
                  image={cardData.card?.image}
                  authorText={cardData?.card.authorText}
                  hasAuthorImage={cardData.card.hasAuthorImage}
                  isAuthorBold={cardData?.card.isAuthorBold}
                  isHidden={true}
                />
              );
            // show non-hidden cards
            else
              return (
                <FlippingCard
                  key={cardData.cardID}
                  frontCard={Card}
                  backCard={CommentCard}
                  backgroundColor={cardData.card.backgroundColor}
                  frontCardProps={{
                    authorID: cardData.authorID,
                    text: cardData.card?.text,
                    image: cardData.card?.image,
                    authorText: cardData.card.authorText,
                    isAuthorBold: cardData.card.isAuthorBold,
                    hasAuthorImage: cardData.card.hasAuthorImage,
                  }}
                  backCardProps={{
                    comments: cardData.comments,
                  }}
                />
              );
          } else if (cardData.authorID == userID) {
            // Show main user's response w/ no flipping
            return (
              <Card
                key={cardData.cardID}
                authorID={cardData.authorID}
                backgroundColor={cardData.card?.backgroundColor}
                text={cardData.card.text}
                image={cardData.card?.image}
                authorText={cardData.card.authorText}
                hasAuthorImage={cardData.card.hasAuthorImage}
                isAuthorBold={cardData.card.isAuthorBold}
                isHidden={false}
              />
            );
          } else {
            return null;
          }
        }}
        cardIndex={0}
        backgroundColor={DARK_BG_COLOR}
        cardVerticalMargin={15}
        cardHorizontalMargin={12}
        onSwiped={() => {
          if (!deck.isLooping) setDeckLength((prev) => prev - 1);
        }}
        onSwipedAll={() => {
          console.log("swiped all");
          setAllowedSwiping(false);
        }}
        stackSize={
          deck?.viewMutuals
            ? deck?.deckCardsData.length >= 4
              ? 4
              : deck?.deckCardsData.length
            : 1
        }
        stackSeparation={0}
        disableTopSwipe
        disableBottomSwipe
        disableRightSwipe={!allowedSwiping}
        disableLeftSwipe={!allowedSwiping}
        verticalSwipe
        showSecondCard={true}
        infinite={deck?.isLooping}
        childrenOnTop
        swipeBackCard
        stackAnimationTension={80}
        stackAnimationFriction={100}
      >
        <View
          style={{
            bottom: -525, // TODO: make this dynamic depending on card height
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 10,
          }}
        >
          {deck.isLooping ? (
            <TouchableOpacity
              style={[
                styles.smallerTouchablePadding,
                !allowedSwiping ? { opacity: 0.2 } : {},
              ]}
              onPress={swipeBackCallBack}
            >
              <LinearGradient
                colors={["#273B4A", "#33363F"]}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("@assets/icons/prev-card-icon.png")}
                  style={{ width: 33, height: 33 }}
                />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <></>
          )}
          <TouchableOpacity
            style={styles.biggerTouchablePadding}
            onPress={() => {
              homeNavigation.navigate("Answer");
            }}
          >
            <LinearGradient
              colors={["#273B4A", "#33363F"]}
              style={{
                width: 60,
                height: 60,
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("@assets/icons/answer-icon.png")}
                style={{ width: 24, height: 32 }}
              />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={swipeForwardCallBack}
            style={[
              styles.smallerTouchablePadding,
              !allowedSwiping ? { opacity: 0.2 } : {},
            ]}
          >
            <LinearGradient
              colors={["#273B4A", "#33363F"]}
              style={{
                width: deck.isLooping ? 50 : 60,
                height: deck.isLooping ? 50 : 60,
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 15,
              }}
            >
              {deck.isLooping ? (
                <Image
                  source={require("@assets/icons/swipe-icon.png")}
                  style={{ width: 35, height: 35 }}
                />
              ) : (
                <Image
                  source={require("@assets/icons/burn-icon.png")}
                  style={{ width: 42, height: 42 }}
                />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Swiper>
    );
  }
}
