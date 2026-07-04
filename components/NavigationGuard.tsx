import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function NavigationGuard() {
  const { user, loaded: authLoaded } = useAuth();
  const { completed, loaded: onboardingLoaded } = useOnboarding();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!authLoaded || !onboardingLoaded) return;

    const inAuthGroup = segments[0] === "auth";
    const inOnboarding = segments[0] === "onboarding";

    if (!user && !inAuthGroup) {
      router.replace("/auth/login");
      return;
    }

    if (user && !completed && !inOnboarding) {
      router.replace("/onboarding");
      return;
    }

    if (user && completed && (inAuthGroup || inOnboarding)) {
      router.replace("/(tabs)");
    }
  }, [authLoaded, onboardingLoaded, user, completed, segments, router]);

  return null;
}
