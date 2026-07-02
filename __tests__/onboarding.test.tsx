import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';

import OnboardingScreen from '../app/onboarding';
import { UserPreferencesProvider } from '../context/UserPreferencesContext';

// jest.mock is hoisted before imports by Babel, so 'router' above resolves to this mock.
// The factory must be self-contained — no external const/let references.
jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), push: jest.fn(), navigate: jest.fn() },
}));

// Wrap every render with the real preferences provider so context hooks work
function renderOnboarding() {
  return render(
    <UserPreferencesProvider>
      <OnboardingScreen />
    </UserPreferencesProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  // Ensure AsyncStorage starts clean for each test
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
});

// ─── Step navigation ─────────────────────────────────────────────────────────

describe('Step navigation', () => {
  it('shows the Welcome step on first render', () => {
    const { getByText } = renderOnboarding();
    expect(getByText('SavGoSpend')).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
  });

  it('advances to Preferences step after tapping Get Started', () => {
    const { getByText } = renderOnboarding();
    fireEvent.press(getByText('Get Started'));
    expect(getByText('Set your preferences')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
  });

  it('advances to Done step after tapping Next', () => {
    const { getByText } = renderOnboarding();
    fireEvent.press(getByText('Get Started'));
    fireEvent.press(getByText('Next'));
    expect(getByText("You're all set!")).toBeTruthy();
    expect(getByText('Enter the App')).toBeTruthy();
  });
});

// ─── Toggle switches ──────────────────────────────────────────────────────────

describe('Toggle switches', () => {
  function goToPreferences() {
    const utils = renderOnboarding();
    fireEvent.press(utils.getByText('Get Started'));
    return utils;
  }

  it('Notifications toggle starts OFF and turns ON when tapped', () => {
    const { getByTestId } = goToPreferences();
    const toggle = getByTestId('toggle-notifications');

    expect(toggle.props.value).toBe(false);
    fireEvent(toggle, 'valueChange', true);
    expect(getByTestId('toggle-notifications').props.value).toBe(true);
  });

  it('Share Location toggle starts OFF and turns ON when tapped', () => {
    const { getByTestId } = goToPreferences();
    const toggle = getByTestId('toggle-share-location');

    expect(toggle.props.value).toBe(false);
    fireEvent(toggle, 'valueChange', true);
    expect(getByTestId('toggle-share-location').props.value).toBe(true);
  });

  it('Larger Text toggle starts OFF and turns ON when tapped', () => {
    const { getByTestId } = goToPreferences();
    const toggle = getByTestId('toggle-larger-text');

    expect(toggle.props.value).toBe(false);
    fireEvent(toggle, 'valueChange', true);
    expect(getByTestId('toggle-larger-text').props.value).toBe(true);
  });

  it('tapping a toggle twice returns it to OFF', () => {
    const { getByTestId } = goToPreferences();
    const toggle = getByTestId('toggle-notifications');

    fireEvent(toggle, 'valueChange', true);
    expect(getByTestId('toggle-notifications').props.value).toBe(true);

    fireEvent(toggle, 'valueChange', false);
    expect(getByTestId('toggle-notifications').props.value).toBe(false);
  });
});

// ─── AsyncStorage persistence ─────────────────────────────────────────────────

describe('AsyncStorage persistence', () => {
  async function completeOnboarding(name = 'Margaret') {
    const utils = renderOnboarding();

    // Step 1: enter name and advance
    fireEvent.changeText(utils.getByPlaceholderText('Enter your name'), name);
    fireEvent.press(utils.getByText('Get Started'));

    // Step 2: turn on a toggle, then advance
    fireEvent(utils.getByTestId('toggle-notifications'), 'valueChange', true);
    fireEvent.press(utils.getByText('Next'));

    // Step 3: press Enter the App and wait for async operations
    fireEvent.press(utils.getByText('Enter the App'));

    return utils;
  }

  it('writes onboarding_completed = "true" to AsyncStorage', async () => {
    await completeOnboarding();

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'onboarding_completed',
        'true'
      );
    });
  });

  it('saves the member name to AsyncStorage', async () => {
    await completeOnboarding('Dorothy');

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('member_name', 'Dorothy');
    });
  });

  it('saves toggle preferences to AsyncStorage', async () => {
    await completeOnboarding();

    await waitFor(() => {
      // Notifications was turned ON
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('pref_notifications', 'true');
      // Share location and larger text stay OFF
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('pref_share_location', 'false');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('pref_larger_text', 'false');
    });
  });

  it('calls router.replace("/(tabs)") after saving', async () => {
    await completeOnboarding();

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });
});
