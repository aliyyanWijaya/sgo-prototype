import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEYS = {
  memberName: "member_name",
  notifications: "pref_notifications",
  shareLocation: "pref_share_location",
  largerText: "pref_larger_text",
} as const;

export interface UserPreferences {
  memberName: string;
  notifications: boolean;
  shareLocation: boolean;
  largerText: boolean;
}

interface UserPreferencesContextValue extends UserPreferences {
  loaded: boolean;
  setPreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K],
  ) => Promise<void>;
  resetPreferences: () => Promise<void>; // ← ini harus ada
  scale: (base: number) => number;
}

const DEFAULTS: UserPreferences = {
  memberName: "",
  notifications: false,
  shareLocation: false,
  largerText: false,
};

const UserPreferencesContext = createContext<UserPreferencesContextValue>({
  ...DEFAULTS,
  loaded: false,
  setPreference: async () => {},
  resetPreferences: async () => {}, // ← dan ini
  scale: (n) => n,
});

export function UserPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const keys = Object.entries(STORAGE_KEYS) as [
      keyof UserPreferences,
      string,
    ][];
    Promise.all(
      keys.map(([k, storageKey]) =>
        AsyncStorage.getItem(storageKey).then((v) => [k, v] as const),
      ),
    ).then((entries) => {
      setPrefs((prev) => {
        const next = { ...prev };
        for (const [key, val] of entries) {
          if (val === null) continue;
          if (key === "memberName") {
            next.memberName = val;
          } else {
            (next as Record<string, unknown>)[key] = val === "true";
          }
        }
        return next;
      });
      setLoaded(true);
    });
  }, []);

  const setPreference = useCallback(
    async <K extends keyof UserPreferences>(
      key: K,
      value: UserPreferences[K],
    ) => {
      setPrefs((prev) => ({ ...prev, [key]: value }));
      await AsyncStorage.setItem(STORAGE_KEYS[key], String(value));
    },
    [],
  );

  const resetPreferences = useCallback(async () => {
    // ← dan ini
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    setPrefs(DEFAULTS);
  }, []);

  const scale = useCallback(
    (base: number) => (prefs.largerText ? Math.round(base * 1.3) : base),
    [prefs.largerText],
  );

  return (
    <UserPreferencesContext.Provider
      value={{ ...prefs, loaded, setPreference, resetPreferences, scale }}
    >
      {/* ↑ resetPreferences harus ikut di-pass di sini */}
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  return useContext(UserPreferencesContext);
}
