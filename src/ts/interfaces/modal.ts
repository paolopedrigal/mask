export interface ModalContentProps {
  title: string;
  leftText: string;
  rightText: string;
  leftCallback: () => void;
  rightCallback: () => void;
}
