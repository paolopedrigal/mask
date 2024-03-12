import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";

export default function SignInUpBackButton() {
  const navigation = useNavigation();

  return (
    <HeaderBackButton
      labelVisible={false}
      tintColor="white"
      onPress={() => {
        navigation.goBack();
      }}
    />
  );
}
