import { View, ImageSourcePropType } from "react-native";
import { Image } from "expo-image";

export default function TabIcon(props: {
  isFocused: boolean;
  focusedIcon: ImageSourcePropType;
  notFocusedIcon: ImageSourcePropType;
  iconStyle: { [index: string]: string | number };
}) {
  return (
    <View>
      {props.isFocused ? (
        <Image style={props.iconStyle} source={props.focusedIcon} />
      ) : (
        <Image style={props.iconStyle} source={props.notFocusedIcon} />
      )}
    </View>
  );
}
