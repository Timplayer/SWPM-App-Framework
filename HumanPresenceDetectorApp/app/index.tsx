import { Text, View } from "react-native";
import Setup from "@/app/setup";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Setup />
    </View>
  );
}
