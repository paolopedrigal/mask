import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
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
import { selectUserID } from "@redux/userSlice";
import { fetchFileFromStorage } from "@utils/supabase-utils";
import { preventAutoHideAsync } from "expo-splash-screen";

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

interface CardPics {
  [key: string]: string | ArrayBuffer | null;
}

export default function Deck(props: DeckProps) {
  const { deckID }: DeckProps = props;
  const [userID, setUserID] = useState<string>(useSelector(selectUserID)); // Get current user's ID
  const [deck, setDeck] = useState<DeckData>(); // Deck data
  const [deckLength, setDeckLength] = useState<number>(0);
  const [replied, setReplied] = useState<boolean>(false);
  const [allowedSwiping, setAllowedSwiping] = useState<boolean>(true);
  const [cardPics, setCardPics] = useState<CardPics>({});

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
        let cardPics: CardPics = {};
        let cardIndex: number = 1;

        for (let i: number = 0; i < data.length; i++) {
          if (data[i].card_id.image_url != null)
            fetchFileFromStorage(
              data[i].card_id.author_id.user_id +
                "/" +
                data[i].card_id.image_url,
              "card_pics"
            ).then((cardPic) => {
              cardPics[data[i].card_id.card_id] = cardPic;
            });

          if (data[i].is_main)
            deckCardsData[0] = {
              cardID: data[i].card_id.card_id,
              authorID: data[i].card_id.author_id.user_id,
              isMain: data[i].is_main,
              card: {
                backgroundColor: data[i].card_id.author_id.fav_color,
                text: data[i].card_id.text,
                image: undefined,
                authorText: data[i].card_id.author_id.username,
                isAuthorBold: false,
                authorImage: undefined,
              },
              comments: [],
            };
          else {
            deckCardsData[cardIndex] = {
              cardID: data[i].card_id.card_id,
              authorID: data[i].card_id.author_id.user_id,
              isMain: data[i].is_main,
              card: {
                backgroundColor: data[i].card_id.author_id.fav_color,
                text: data[i].card_id.text,
                image: undefined,
                authorText: data[i].card_id.author_id.username,
                isAuthorBold: false,
                authorImage: undefined,
              },
              comments: [],
            };
            cardIndex++;
          }
        }

        /*
         * No swiping activated:
         *  a) is_looping and only 1 card left OR
         *  b) !is_looping and no cards left (See `onSwipedAll` prop)
         */

        // Only 1 card in deck
        if (data.length == 1 && data[0].deck_id.is_looping) {
          console.log("setting no swiping to true");
          setAllowedSwiping(false);
          // reloadSwiper();
        } else {
          setAllowedSwiping(true);
          // reloadSwiper();
        }

        setDeck({
          deckCardsData: deckCardsData,
          isLooping: data[0].deck_id.is_looping,
          viewMutuals: data[0].deck_id.view_mutuals,
        });

        setCardPics(cardPics);

        setDeckLength(data.length);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    if (deckID) fetchDeck();
  }, [deckID]);

  useEffect(() => {
    console.log("deckLength:", deckLength);
  }, [deckLength]);

  if (!deck || deckLength <= 0) return <Text>No deck from deck.tsx</Text>;
  else {
    return (
      <Swiper
        key={deck.deckCardsData.length} // key has to be length of `cards` to have dynamic size in `cards`
        ref={swiper}
        cards={
          deck.deckCardsData
          // deck?.viewMutuals ? deck.deckCardsData
          // :
          // deck?.deckCardsData.filter(
          //     (cardData) => cardData.userID == userID || cardData.isMain
          //   )
        }
        renderCard={(cardData) => {
          if (cardData.isMain) {
            // show main card
            return (
              <Card
                key={cardData.cardID}
                backgroundColor={cardData.card.backgroundColor}
                text={cardData.card?.text}
                image={cardData.card?.image}
                authorText={cardData.card.authorText}
                authorImage={cardData.card?.authorImage}
                isAuthorBold={cardData.card.isAuthorBold}
                isHidden={false}
              />
            );
          } else if (deck.viewMutuals) {
            if (
              !replied
              // Undo this later
              // ||
              // (replied &&
              //   !listofFriendsIDs.has(cardData?.userID) &&
              //   cardData?.userID != userID)
            )
              // if viewing mutuals is allowed
              // show hidden cards
              //   return (
              //     <Card
              //       key={cardData?.cardID}
              //       backgroundColor={cardData?.card.backgroundColor}
              //       text={cardData?.card.text}
              //       image={cardPics} //{cardData?.card.image}
              //       authorText={cardData?.card.authorText}
              //       authorImage={cardData?.card.authorImage}
              //       isAuthorBold={cardData?.card.isAuthorBold}
              //       isHidden={true}
              //     />
              //   );
              // show non-hidden cards
              // else
              return (
                <FlippingCard
                  key={cardData.cardID}
                  frontCard={Card}
                  backCard={CommentCard}
                  backgroundColor={cardData.card.backgroundColor}
                  frontCardProps={{
                    text: cardData.card?.text,
                    image: cardPics[cardData.cardID], //cardData?.card.image,
                    authorText: cardData.card.authorText,
                    isAuthorBold: cardData.card.isAuthorBold,
                    authorImage: cardData.card?.authorImage,
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
                backgroundColor={cardData.card?.backgroundColor}
                text={cardData.card.text}
                image={cardData.card?.image}
                authorText={cardData.card.authorText}
                authorImage={cardData.card?.authorImage}
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
        verticalSwipe={false}
        showSecondCard={true}
        infinite={deck?.isLooping}
        childrenOnTop
        swipeBackCard
        stackAnimationTension={80}
        stackAnimationFriction={100}
      >
        <View
          style={{
            bottom: -525, // TODO: make this dynamice depending on card height
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 10,
          }}
        >
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
                width: 50, // 60,
                height: 50, //60,
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("@assets/icons/prev-card-icon.png")}
                style={{ width: 33, height: 33 }} // {{ width: 40, height: 40 }}
              />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.biggerTouchablePadding}>
            <LinearGradient
              colors={["#273B4A", "#33363F"]}
              style={{
                width: 60, // 75
                height: 60, // 75
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("@assets/icons/answer-icon.png")}
                style={{ width: 24, height: 32 }} //{{ width: 30, height: 40 }}
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
                width: 50, //60,
                height: 50, //60,
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 15,
              }}
            >
              <Image
                source={require("@assets/icons/swipe-icon.png")}
                style={{ width: 35, height: 35 }} //{{ width: 42, height: 42 }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Swiper>
    );
  }
}
