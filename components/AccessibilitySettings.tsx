// components/AccessibilitySettings.tsx
import Slider from "@react-native-community/slider";
import { StyleSheet, Switch, View } from "react-native";
import { useAccessibility } from "../context/AccessibilityContext";
import AppText from "./AppText";

export default function AccessibilitySettings() {
  const { fontScale, setFontScale, highContrast, toggleHighContrast } =
    useAccessibility();

  return (
    <View style={styles.container}>
      <AppText size="lg" style={styles.heading}>
        Text Size
      </AppText>
      <AppText size="base">Preview: this is what text looks like</AppText>
      <Slider
        minimumValue={0.85}
        maximumValue={1.6}
        step={0.05}
        value={fontScale}
        onValueChange={setFontScale}
        minimumTrackTintColor="#2E7D32"
        style={{ width: "100%", height: 40 }}
      />
      <AppText size="sm">{Math.round(fontScale * 100)}%</AppText>

      <View style={styles.row}>
        <AppText size="lg">High Contrast</AppText>
        <Switch value={highContrast} onValueChange={toggleHighContrast} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  heading: { fontWeight: "bold" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
});
