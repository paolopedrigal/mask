import { EditCardScreenProps } from "@_types/NavigationTypes";
import { Pressable, Text, View } from "react-native";
import EditCard from "@components/EditCard";
import { DARK_BG_COLOR } from "@assets/styles/colors";

export default function EditCardScreen({
  navigation,
  route,
}: EditCardScreenProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        backgroundColor: DARK_BG_COLOR,
      }}
    >
      <EditCard />
      <Pressable
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 42,
          width: 100,
          borderRadius: 25,
          backgroundColor: "#323232",
        }}
        onPress={() => navigation.push("PostCard")}
      >
        <Text>Next</Text>
      </Pressable>
    </View>
  );
}
