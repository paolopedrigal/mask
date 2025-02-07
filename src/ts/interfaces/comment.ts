import { ImageSource } from "expo-image";

export interface CommentProps {
  authorImage: ImageSource;
  authorText: string;
  comment: string;
  secondaryBackgroundColor?: string;
  hasHighLuminance?: boolean;
}
