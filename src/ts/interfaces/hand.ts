import { CardProps } from "./card";
import { ImageSource } from "expo-image";

// TODO: Get typing for key, disabledDrag, and disabledReSorted from "react-native-draggable-grid"
export interface HandData extends CardProps {
  key: string;
  disabledDrag?: boolean;
  disabledReSorted?: boolean;
}

export interface HandPreviewProps {
  handImages: ImageSource[];
  showHandCallback: () => void;
}
