// app/(tabs)/map.tsx
import AppText from "@/components/AppText";
import { View } from "react-native";
export default function MapFallback() {
  return (
    <View>
      <AppText>Loading map…</AppText>
    </View>
  );
}
