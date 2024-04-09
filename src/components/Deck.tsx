import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { CardProps, CommentProps } from "@_types/CardTypes";
import Card from "@components/Card";
import Swiper from "react-native-deck-swiper";
import { useRef } from "react";
import FlippingCard from "@components/FlippingCard";
import CommentCard from "@components/CommentCard";
import { DARK_BG_COLOR, QUESTION_CARD_BG_COLOR } from "@assets/styles/colors";
import { FlatList } from "react-native-gesture-handler";

// const styles = StyleSheet.create({
//   home: {
//     backgroundColor: "#0C0B44",
//   },
// });

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
});

const isHidden = true;

interface Data {
  id: number;
  card: CardProps;
  comments: CommentProps[];
}

// Not tracking dummy data in git
const data: Data[] = [
  {
    id: 1,
    card: {
      backgroundColor: QUESTION_CARD_BG_COLOR,
      text: "Who was the celebrity you've been the closest to?",
      authorText: "Question of the Day",
      isAuthorBold: true,
      isHidden: false,
    },
    comments: [],
  },
  {
    id: 2,
    card: {
      backgroundColor: "#2A2A6B",
      text: "Bruno Mars in Las Vegas!",
      image: require("@assets/images/vegas.jpg"),
      authorText: "maikaroni",
      authorImage: require("@assets/images/test-pfp.jpg"),
      isAuthorBold: false,
      isHidden: isHidden,
      width: 350,
    },
    comments: [
      {
        authorImage: require("@assets/images/test-pfp.jpg"),
        authorText: "boombampao",
        comment:
          "Wow! This is a really long comment about Bruno Mars in Las Vegas, Nevada during July of 2023! Wow!",
      },
    ],
  },
  {
    id: 3,
    card: {
      backgroundColor: "#FEFFCB",
      text: "Pitbull at work! I was with @banditgawd and @boombapo and they saw also lol",
      authorText: "johnmiranda",
      authorImage: require("@assets/images/test-pfp.jpg"),
      isAuthorBold: false,
      isHidden: isHidden,
    },
    comments: [
      {
        authorImage: require("@assets/images/test-pfp.jpg"),
        authorText: "boombampao",
        comment: "yeah i did not expect to see pitbull in my life",
      },
    ],
  },
  {
    id: 4,
    card: {
      backgroundColor: "#131254",
      image: require("@assets/images/linsanity.jpg"),
      authorText: "buansanity",
      authorImage: require("@assets/images/test-pfp.jpg"),
      isAuthorBold: false,
      isHidden: isHidden,
    },
    comments: [
      {
        authorImage: require("@assets/images/test-pfp.jpg"),
        authorText: "boombampao",
        comment: "jerGOAT lin",
      },
      {
        authorImage: require("@assets/images/test-pfp.jpg"),
        authorText: "boombampao",
        comment: "yeah i did not expect to see pitbull in my life",
      },
    ],
  },
  {
    id: 5,
    card: {
      backgroundColor: "#9BC4E2",
      text: "twice!",
      authorText: "kikay2005",
      authorImage: require("@assets/images/test-pfp.jpg"),
      isAuthorBold: false,
      isHidden: isHidden,
    },
    comments: [
      {
        authorImage: require("@assets/images/test-pfp.jpg"),
        authorText: "boombampao",
        comment: "jerGOAt lin",
      },
    ],
  },
];

export default function Deck() {
  const swiper = useRef<Swiper<Data>>(null);
  const swipeBackCallBack = () => {
    if (swiper.current) {
      swiper.current.swipeBack();
    }
  };
  const swipeForwardCallBack = () => {
    if (swiper.current) {
      swiper.current.swipeRight();
    }
  };
  return (
    <Swiper
      ref={swiper}
      cards={data}
      cardIndex={0}
      backgroundColor={DARK_BG_COLOR}
      cardVerticalMargin={25}
      cardHorizontalMargin={12}
      renderCard={(data) => {
        const card = data.card;
        if (data.id == 1 || data.card.isHidden) {
          return (
            <Card
              backgroundColor={card.backgroundColor}
              text={card.text}
              image={card?.image}
              authorText={card.authorText}
              authorImage={card.authorImage}
              isAuthorBold={card.isAuthorBold}
              isHidden={card.isHidden}
              width={card.width}
            />
          );
        } else
          return (
            <FlippingCard
              frontCard={Card}
              backCard={CommentCard}
              width={350}
              backgroundColor={card.backgroundColor}
              frontCardProps={{
                text: card.text,
                image: card?.image,
                authorText: card.authorText,
                isAuthorBold: card.isAuthorBold,
                authorImage: card.authorImage,
              }}
              backCardProps={{
                comments: data.comments,
              }}
            />
          );
      }}
      stackSize={4}
      stackSeparation={0}
      disableTopSwipe
      disableBottomSwipe
      verticalSwipe={false}
      showSecondCard={true}
      infinite
      childrenOnTop
      swipeBackCard
      stackAnimationTension={50}
      stackAnimationFriction={100}
    >
      <View
        style={{
          // position: "absolute",
          bottom: -530, // TODO: make this dynamice depending on card height
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <Pressable
          style={{
            paddingHorizontal: 20,
          }}
          onPress={swipeBackCallBack}
        >
          <Image
            source={require("@assets/icons/prev-card-icon.png")}
            style={{ width: 50, height: 50 }}
          />
        </Pressable>
        <Pressable
          style={{
            paddingHorizontal: 20,
          }}
        >
          <Image
            source={require("@assets/icons/answer-icon.png")}
            style={{ width: 50, height: 50 }}
          />
        </Pressable>
        <Pressable
          onPress={swipeForwardCallBack}
          style={{
            paddingHorizontal: 15,
          }}
        >
          <Image
            source={require("@assets/icons/swipe-icon.png")}
            style={{ width: 60, height: 60 }}
          />
        </Pressable>
      </View>
    </Swiper>
  );
}
