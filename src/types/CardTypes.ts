import { DimensionValue, ImageSourcePropType } from "react-native";

export interface CardProps {
  authorText: string;
  backgroundColor?: string;
  width?: DimensionValue;
  height?: DimensionValue;
  text?: string;
  fontSize?: number;
  image?: ImageSourcePropType;
  isAuthorBold: boolean;
  authorImage?: ImageSourcePropType;
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
  authorImage: ImageSourcePropType;
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
