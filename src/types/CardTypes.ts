import { DimensionValue, ImageSourcePropType } from "react-native";

export interface CardProps {
  authorText: string;
  backgroundColor?: string;
  width?: DimensionValue;
  text?: string;
  image?: ImageSourcePropType;
  isAuthorBold: boolean;
  authorImage?: ImageSourcePropType;
  isHidden?: boolean;
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
  width: number;
  backgroundColor?: string;
  frontCardProps: CardProps;
  backCardProps: CommentCardProps;
}
