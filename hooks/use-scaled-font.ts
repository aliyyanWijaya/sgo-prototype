import { useUserPreferences } from '@/context/UserPreferencesContext';

export function useScaledFont() {
  const { largerText, scale } = useUserPreferences();
  return {
    multiplier: largerText ? 1.3 : 1.0,
    scale,
  };
}
