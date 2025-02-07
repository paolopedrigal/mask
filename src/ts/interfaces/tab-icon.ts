import { ImageSource } from "expo-image";

export interface TabIconProps {
  isFocused: boolean;
  focusedIcon: ImageSource;
  notFocusedIcon: ImageSource;
  iconStyle: { [index: string]: string | number };
}
