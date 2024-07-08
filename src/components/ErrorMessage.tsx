import { HIGH_PRIORITY_TEXT_COLOR } from "@assets/styles/colors";
import { StyleSheet, Text, View } from "react-native";

interface ErrorMessageProps {
  message: string;
}

const styles = StyleSheet.create({
  errorMessageContainer: {
    zIndex: 2,
    position: "absolute",
    bottom: 40,
    justifyContent: "center",
    alignSelf: "center",
    width: "80%",
  },
  errorMessageView: {
    backgroundColor: "#273B4A",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  errorMessageText: {
    color: HIGH_PRIORITY_TEXT_COLOR,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    textAlign: "center",
  },
});

export default function ErrorMessage(props: ErrorMessageProps) {
  return (
    <View style={styles.errorMessageContainer}>
      <View style={styles.errorMessageView}>
        <Text style={styles.errorMessageText}>{props.message}</Text>
      </View>
    </View>
  );
}
