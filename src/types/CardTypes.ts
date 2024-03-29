import { DimensionValue, ImageSourcePropType } from "react-native";

export interface CardProps {
  backgroundColor: string;
  width?: DimensionValue;
  text?: string;
  image?: ImageSourcePropType;
  authorText: string;
  isAuthorBold: boolean;
  authorImage?: ImageSourcePropType;
  isHidden?: boolean;
}
