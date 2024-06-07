import { ImageSource } from "expo-image";
import { DimensionValue } from "react-native";

export interface CardProps {
  authorID: string;
  authorText: string;
  backgroundColor?: string;
  width?: DimensionValue;
  height?: DimensionValue;
  text?: string | null;
  fontSize?: number;
  image?: ImageSource;
  isAuthorBold: boolean;
  hasAuthorImage: boolean;
  authorFontSize?: number;
  isHidden?: boolean;
  paddingHorizontal?: number;
  paddingTop?: number;
  paddingBottom?: number;
  scalar?: number;
}

export interface CommentCardProps {
  backgroundColor?: string;
  comments: CommentProps[];
}

export interface CommentProps {
  authorImage: ImageSource;
  authorText: string;
  comment: string;
  secondaryBackgroundColor?: string;
  hasHighLuminance?: boolean;
}

export interface FlippingCardProps {
  frontCard: (props: CardProps) => JSX.Element;
  backCard: (props: CommentCardProps) => JSX.Element;
  frontCardProps: CardProps;
  backCardProps: CommentCardProps;
  width?: number;
  height?: number;
  backgroundColor?: string;
}
