import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferencesProvider } from '@/context/UserPreferencesContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Redirects to /onboarding when the user hasn't completed it yet,
// and prevents navigating back to /onboarding once they have.
function OnboardingGuard() {
  const [checked, setChecked] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('onboarding_completed').then((val) => {
      setOnboardingDone(val === 'true');
      setChecked(true);
    });
  }, []);

  useEffect(() => {
    if (!checked) return;
    const inOnboarding = segments[0] === 'onboarding';
    if (!onboardingDone && !inOnboarding) {
      router.replace('/onboarding');
    } else if (onboardingDone && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [checked, onboardingDone, segments, router]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <UserPreferencesProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="whats-on" options={{ title: "What's On" }} />
          <Stack.Screen name="good-to-know" options={{ title: 'Good to Know' }} />
          <Stack.Screen
            name="aroha"
            options={{
              title: 'Aroha',
              headerStyle: { backgroundColor: '#2B7A77' },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: { fontWeight: '700', fontSize: 18 },
            }}
          />
        </Stack>
        <OnboardingGuard />
        <StatusBar style="auto" />
      </ThemeProvider>
    </UserPreferencesProvider>
  );
}
