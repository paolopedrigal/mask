import {
  DimensionValue,
  Image,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

const styles = StyleSheet.create({
  card: {
    height: 500,
    borderRadius: 15,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 40,
    paddingBottom: 30,
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignContent: "space-between",
  },
  image: {
    height: 500,
  },
  innerImage: {
    flex: 1,
    borderRadius: 15,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 40,
    paddingBottom: 30,
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignContent: "space-between",
  },
  text: {
    fontFamily: "Inter-Bold",
    fontSize: 32,
    color: "white",
    textAlign: "left",
    width: "100%",
  },
  authorView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    height: 50,
  },
  authorImage: {
    width: 45,
    height: 45,
    borderRadius: 100,
    borderColor: "#7C7CD4",
    borderWidth: 2,
  },
  authorText: {
    fontSize: 16,
    color: "white",
    textAlign: "left",
  },
});

interface CardProps {
  backgroundColor: string;
  width?: DimensionValue | undefined;
  text?: string;
  image?: ImageSourcePropType;
  authorText: string;
  isAuthorBold: boolean;
  authorImage?: ImageSourcePropType;
}

export default function Card(props: CardProps) {
  const DEFAULT_WIDTH: DimensionValue = "100%";
  const propsStyle = props.width
    ? { backgroundColor: props.backgroundColor, width: props?.width }
    : { backgroundColor: props.backgroundColor, width: DEFAULT_WIDTH };

  if (props.image)
    return (
      <ImageBackground
        style={styles.image}
        imageStyle={{
          borderRadius: 15,
        }}
        resizeMode="cover"
        source={props.image}
      >
        <View
          style={[
            styles.innerImage,
            props.text ? { backgroundColor: "rgba(0,0,0, 0.60)" } : {},
          ]}
        >
          <Text style={styles.text}>{props.text}</Text>
          <View style={styles.authorView}>
            {props?.authorImage ? (
              <Image source={props.authorImage} style={styles.authorImage} />
            ) : (
              <></>
            )}
            <Text
              style={[
                props.isAuthorBold
                  ? { fontFamily: "Inter-Bold" }
                  : { fontFamily: "Inter-Regular" },
                styles.authorText,
              ]}
            >
              {props.authorText}
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  else
    return (
      <View style={[propsStyle, styles.card]}>
        <Text style={styles.text}>{props.text}</Text>
        <View style={styles.authorView}>
          {props?.authorImage ? (
            <Image source={props.authorImage} style={styles.authorImage} />
          ) : (
            <></>
          )}
          <Text
            style={[
              props.isAuthorBold
                ? { fontFamily: "Inter-Bold" }
                : { fontFamily: "Inter-Regular" },
              styles.authorText,
            ]}
          >
            {props.authorText}
          </Text>
        </View>
      </View>
    );
}
