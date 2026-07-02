import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { UserPreferencesProvider, useUserPreferences } from '@/context/UserPreferencesContext';
import { useScaledFont } from '@/hooks/use-scaled-font';

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('Larger Text preference', () => {
  it('setPreference("largerText", true) writes pref_larger_text=true to AsyncStorage', async () => {
    let capturedSet: ((v: boolean) => Promise<void>) | undefined;

    function Consumer() {
      const { setPreference } = useUserPreferences();
      capturedSet = (v) => setPreference('largerText', v);
      return null;
    }

    render(
      <UserPreferencesProvider>
        <Consumer />
      </UserPreferencesProvider>
    );

    await act(async () => {
      await capturedSet!(true);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('pref_larger_text', 'true');
  });

  it('setPreference("largerText", false) writes pref_larger_text=false to AsyncStorage', async () => {
    let capturedSet: ((v: boolean) => Promise<void>) | undefined;

    function Consumer() {
      const { setPreference } = useUserPreferences();
      capturedSet = (v) => setPreference('largerText', v);
      return null;
    }

    render(
      <UserPreferencesProvider>
        <Consumer />
      </UserPreferencesProvider>
    );

    await act(async () => {
      await capturedSet!(false);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('pref_larger_text', 'false');
  });

  it('useScaledFont returns multiplier 1.0 when largerText is off (default)', async () => {
    let capturedMultiplier: number | undefined;

    function Consumer() {
      const { multiplier } = useScaledFont();
      capturedMultiplier = multiplier;
      return null;
    }

    render(
      <UserPreferencesProvider>
        <Consumer />
      </UserPreferencesProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(capturedMultiplier).toBe(1.0);
  });

  it('useScaledFont returns multiplier 1.3 when largerText is on', async () => {
    await AsyncStorage.setItem('pref_larger_text', 'true');

    let capturedMultiplier: number | undefined;

    function Consumer() {
      const { multiplier } = useScaledFont();
      capturedMultiplier = multiplier;
      return null;
    }

    render(
      <UserPreferencesProvider>
        <Consumer />
      </UserPreferencesProvider>
    );

    await waitFor(() => {
      expect(capturedMultiplier).toBe(1.3);
    });
  });
});
