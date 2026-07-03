import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { OnboardingProvider, useOnboarding } from "@/context/OnboardingContext";
import { UserPreferencesProvider } from "@/context/UserPreferencesContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

function OnboardingGuard() {
  const { completed, loaded } = useOnboarding();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loaded) return;
    const inOnboarding = segments[0] === "onboarding";
    if (!completed && !inOnboarding) {
      router.replace("/onboarding");
    } else if (completed && inOnboarding) {
      router.replace("/(tabs)");
    }
  }, [loaded, completed, segments, router]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <OnboardingProvider>
      <UserPreferencesProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
            <Stack.Screen name="whats-on" options={{ title: "What's On" }} />
            <Stack.Screen
              name="good-to-know"
              options={{ title: "Good to Know" }}
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
          <OnboardingGuard />
          <StatusBar style="auto" />
        </ThemeProvider>
      </UserPreferencesProvider>
    </OnboardingProvider>
  );
}
