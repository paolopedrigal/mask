import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import {
  decrementSignInUpScreen,
  selectSignInUpScreen,
} from "@redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SignInUpBackButton() {
  const dispatch = useDispatch();
  const signInUpScreen: number = useSelector(selectSignInUpScreen);
  const navigation = useNavigation();

  return (
    <HeaderBackButton
      labelVisible={false}
      tintColor="white"
      onPress={() => {
        navigation.goBack();
        if (signInUpScreen > 1) dispatch(decrementSignInUpScreen());
      }}
    />
  );
}
