// components/AppText.tsx
import { Text, TextProps } from "react-native";
import { useAccessibility } from "../context/AccessibilityContext";

type Props = TextProps & { size?: "sm" | "base" | "lg" | "xl" };

const BASE_SIZES = { sm: 14, base: 16, lg: 20, xl: 28 };

export default function AppText({ size = "base", style, ...props }: Props) {
  const { fontScale, highContrast } = useAccessibility();
  return (
    <Text
      {...props}
      style={[
        {
          fontSize: BASE_SIZES[size] * fontScale,
          color: highContrast ? "#FFFFFF" : undefined,
        },
        style,
      ]}
    />
  );
}
