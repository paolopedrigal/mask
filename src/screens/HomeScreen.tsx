import {
  DimensionValue,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Card from "@components/Card";
import Swiper from "react-native-deck-swiper";
import { useRef } from "react";

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

const data = [
  {
    id: "1",
    backgroundColor: "#7A7ACA",
    text: "Who was the celebrity you've been the closest to?",
    authorText: "Question of the Day",
    isAuthorBold: true,
  },
  {
    id: "2",
    backgroundColor: "#2A2A6B",
    text: "Bruno Mars in Las Vegas!",
    image: require("@assets/images/vegas.jpg"),
    authorText: "maikaroni",
    authorImage: require("@assets/images/test-pfp.jpg"),
    isAuthorBold: false,
  },
  {
    id: "3",
    backgroundColor: "#24245E",
    text: "Pitbull at work",
    authorText: "johnmiranda",
    authorImage: require("@assets/images/test-pfp.jpg"),
    isAuthorBold: false,
  },
  {
    id: "4",
    backgroundColor: "#131254",
    // text: "Jeremy Lin bruv",
    image: require("@assets/images/linsanity.jpg"),
    authorText: "buansanity",
    authorImage: require("@assets/images/test-pfp.jpg"),
    isAuthorBold: false,
  },
];

interface CardProps {
  backgroundColor: string;
  width?: DimensionValue | undefined;
  text?: string;
  image?: ImageSourcePropType; // TODO: Not sure if this should be a string or some image prop
  authorText: string;
  isAuthorBold: boolean;
  authorImage?: ImageSourcePropType;
}

export default function HomeScreen() {
  const swiper = useRef<Swiper<CardProps>>(null);
  const press = () => {
    if (swiper.current) {
      console.log("Swiping back");
      swiper.current.swipeBack();
    }
  };
  return (
    <Swiper
      ref={swiper}
      cards={data}
      cardIndex={0} // dont know about this
      // containerStyle={{ alignItems: "center", justifyContent: "center" }}
      backgroundColor={"#0C0B44"}
      cardVerticalMargin={30}
      cardHorizontalMargin={12}
      renderCard={(card) => (
        <Card
          backgroundColor={card.backgroundColor}
          text={card.text}
          image={card?.image}
          authorText={card.authorText}
          authorImage={card.authorImage}
          isAuthorBold={card.isAuthorBold}
        />
      )}
      stackSize={4}
      stackSeparation={0}
      // disableTopSwipe
      // disableBottomSwipe
      // goBackToPreviousCardOnSwipeLeft
      disableLeftSwipe
      disableRightSwipe
      disableBottomSwipe
      // goBackToPreviousCardOnSwipeBottom
      showSecondCard={true}
      infinite
      childrenOnTop
      swipeBackCard
      stackAnimationTension={1}
      // onSwipedBottom={press}
    >
      <Pressable style={{ position: "absolute", bottom: 30 }} onPress={press}>
        <Text style={{ color: "white" }}>Go back</Text>
      </Pressable>
    </Swiper>
  );
}
