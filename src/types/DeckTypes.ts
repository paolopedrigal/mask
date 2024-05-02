import { CardProps, CommentProps } from "./CardTypes";

export interface DeckCardData {
  cardID: string;
  authorID: string;
  isMain: boolean;
  card: CardProps;
  comments: CommentProps[];
}

export interface DeckData {
  deckCardsData: DeckCardData[];
  isLooping: boolean;
  viewMutuals: boolean;
}

export interface DeckProps {
  deckID: string;
}
