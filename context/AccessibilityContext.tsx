// contexts/AccessibilityContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type AccessibilityContextType = {
  fontScale: number; // 1.0 = normal, 1.2 = besar, 1.5 = extra besar
  setFontScale: (scale: number) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  isLoaded: boolean;
};

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

const STORAGE_KEY = "sgo_accessibility_settings";

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fontScale, setFontScaleState] = useState(1.0);
  const [highContrast, setHighContrast] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const { fontScale, highContrast } = JSON.parse(saved);
          setFontScaleState(fontScale ?? 1.0);
          setHighContrast(highContrast ?? false);
        }
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const persist = async (next: {
    fontScale: number;
    highContrast: boolean;
  }) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const setFontScale = (scale: number) => {
    setFontScaleState(scale);
    persist({ fontScale: scale, highContrast });
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    persist({ fontScale, highContrast: next });
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontScale,
        setFontScale,
        highContrast,
        toggleHighContrast,
        isLoaded,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx)
    throw new Error(
      "useAccessibility harus dipakai di dalam AccessibilityProvider",
    );
  return ctx;
}
