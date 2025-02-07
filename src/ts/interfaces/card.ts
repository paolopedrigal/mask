import { ImageSource } from "expo-image";
import { DimensionValue } from "react-native";
import { CommentProps } from "./comment";

export interface CardProps {
  authorID: string;
  authorText?: string;
  backgroundColor?: string;
  width?: DimensionValue;
  height?: DimensionValue;
  text?: string | null;
  fontSize?: number;
  image?: ImageSource;
  isAuthorBold?: boolean;
  authorImage?: ImageSource;
  hasAuthorImage?: boolean;
  authorFontSize?: number;
  isHidden?: boolean;
  paddingHorizontal?: number;
  paddingTop?: number;
  paddingBottom?: number;
  borderRadius?: number;
  scalar?: number;
}

export interface CommentCardProps {
  backgroundColor?: string;
  comments: CommentProps[];
}

export interface EditCardProps {
  cardText: string;
  setCardText: (text: string) => void;
  image?: string;
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

export interface FlippingCardButtonProps {
  flippingCardCallback: () => void;
  isFrontCard: boolean;
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
  hasHighLuminance?: boolean;
}

interface SelectedFriendsInterface {
  [key: string]: boolean;
}

export interface PostCardFriendListItemProps {
  friendID: string;
  friendUsername: string;
  selectedFriends: SelectedFriendsInterface;
  selectItemCallback: (friendID: string) => void;
}
