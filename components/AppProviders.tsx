import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { AuthProvider } from "@/context/AuthContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { UserPreferencesProvider } from "@/context/UserPreferencesContext";
import React from "react";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <OnboardingProvider>
          <UserPreferencesProvider>{children}</UserPreferencesProvider>
        </OnboardingProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}
