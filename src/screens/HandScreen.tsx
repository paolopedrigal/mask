import { Image, ImageSource } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import Card from "../components/Card";
import { HandScreenProps } from "@_types/NavigationTypes";
import { DARK_BG_COLOR } from "@assets/styles/colors";
import { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { selectUserID } from "@redux/userSlice";

export default function HandScreen({ route }: HandScreenProps) {
  const { handImages } = route.params;
  const swiperRef = useRef<Swiper<ImageSource>>(null);
  const authorID: string = useSelector(selectUserID);

  const swipeBackCallBack = () => {
    if (swiperRef.current) {
      swiperRef.current.swipeBack();
    }
  };

  const swipeForwardCallBack = () => {
    if (swiperRef.current) {
      swiperRef.current.swipeRight();
    }
  };

  if (handImages == undefined) return <Text>NO hand</Text>;

  return (
    <Swiper
      ref={swiperRef}
      cards={handImages}
      renderCard={(cardImage) => (
        <Card
          authorID={authorID}
          authorText={"boombampao"}
          isAuthorBold={false}
          hasAuthorImage={true}
          image={cardImage}
        />
      )}
      backgroundColor={DARK_BG_COLOR}
      cardVerticalMargin={25}
      cardHorizontalMargin={12}
      cardIndex={0}
      disableTopSwipe
      disableBottomSwipe
      // verticalSwipe={false}
      infinite
      swipeBackCard
      // showSecondCard
      stackSize={handImages.length}
      stackSeparation={0}
      stackAnimationTension={100}
      stackAnimationFriction={100}
      childrenOnTop
      onSwiped={(cardIndex) => console.log("Finish swiping", cardIndex)}
    >
      <View
        style={{
          bottom: -565, // TODO: make this dynamic depending on card height
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <TouchableOpacity
          style={{ paddingHorizontal: 5 }}
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
        <TouchableOpacity
          onPress={swipeForwardCallBack}
          style={{ paddingHorizontal: 5 }}
        >
          <LinearGradient
            colors={["#273B4A", "#33363F"]}
            style={{
              width: 50,
              height: 50,
              borderRadius: 100,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 15,
            }}
          >
            <Image
              source={require("@assets/icons/swipe-icon.png")}
              style={{ width: 35, height: 35 }}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Swiper>
  );
}
