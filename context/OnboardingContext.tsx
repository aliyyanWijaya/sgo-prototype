import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const KEY = "onboarding_completed";

interface OnboardingContextValue {
  completed: boolean;
  loaded: boolean;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue>({
  completed: false,
  loaded: false,
  completeOnboarding: async () => {},
  resetOnboarding: async () => {},
});

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [completed, setCompleted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((val) => {
      setCompleted(val === "true");
      setLoaded(true);
    });
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(KEY, "true");
    setCompleted(true); // ← state langsung update, nggak nunggu re-fetch
  }, []);

  const resetOnboarding = useCallback(async () => {
    await AsyncStorage.removeItem(KEY);
    setCompleted(false);
  }, []);

  return (
    <OnboardingContext.Provider
      value={{ completed, loaded, completeOnboarding, resetOnboarding }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}
