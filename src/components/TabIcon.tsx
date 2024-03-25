import { View, Image, ImageSourcePropType } from "react-native";

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
