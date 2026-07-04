import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AppProviders } from "@/components/AppProviders";
import { NavigationGuard } from "@/components/NavigationGuard";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppProviders>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
          <Stack.Screen
            name="aroha"
            options={{
              title: "Aroha",
              headerStyle: { backgroundColor: "#2B7A77" },
              headerTintColor: "#FFFFFF",
              headerTitleStyle: { fontWeight: "700", fontSize: 18 },
            }}
          />
        </Stack>
        <NavigationGuard />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProviders>
  );
}
