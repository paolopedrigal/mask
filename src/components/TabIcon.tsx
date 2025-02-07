import { TabIconProps } from "@ts/interfaces/tab-icon";
import { Image } from "expo-image";
import { View } from "react-native";

export default function TabIcon(props: TabIconProps) {
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
