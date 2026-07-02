import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(),
    },
  },
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), navigate: jest.fn() },
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useSegments: () => [],
}));

// Minimal context mock — scale() is identity, no real provider needed.
jest.mock('@/context/UserPreferencesContext', () => ({
  useUserPreferences: () => ({
    scale: (n: number) => n,
    memberName: 'Test User',
    notifications: false,
    shareLocation: false,
    largerText: false,
    setPreference: jest.fn(),
  }),
}));

// Silence fetch — no tests here exercise the chat API.
global.fetch = jest.fn();

// ─── Test subject ─────────────────────────────────────────────────────────────
import ArohaScreen from '@/app/aroha';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Flush all pending microtasks and React state updates. */
const flushAsync = () => act(async () => { await Promise.resolve(); });

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Aroha pronunciation guide', () => {
  /**
   * Test approach: the "Got it!" dismiss button (testID="aroha-intro-dismiss")
   * is reliably queryable inside React Native's Modal in this RNTL environment.
   * We use its presence/absence as a proxy for modal visibility throughout.
   */

  it('shows the pronunciation modal on first visit (aroha_intro_seen not set)', async () => {
    const { getByTestId, getByText } = render(<ArohaScreen />);

    // Wait for the AsyncStorage check to resolve and modal to mount.
    await waitFor(() => {
      expect(getByTestId('aroha-intro-dismiss')).toBeTruthy();
    });

    // The phonetic guide should be visible inside the modal.
    expect(getByTestId('aroha-phonetic')).toBeTruthy();

    // Confirm the dismiss button label.
    expect(getByText('Got it!')).toBeTruthy();
  });

  it('does NOT show the modal when aroha_intro_seen is already true', async () => {
    await AsyncStorage.setItem('aroha_intro_seen', 'true');

    const { queryByTestId } = render(<ArohaScreen />);

    // Flush the async check — state should stay false (val === 'true').
    await flushAsync();

    // Dismiss button must not be in the tree.
    expect(queryByTestId('aroha-intro-dismiss')).toBeNull();
  });

  it('sets aroha_intro_seen in AsyncStorage when Got it is tapped', async () => {
    const { getByTestId } = render(<ArohaScreen />);

    await waitFor(() => getByTestId('aroha-intro-dismiss'));
    fireEvent.press(getByTestId('aroha-intro-dismiss'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('aroha_intro_seen', 'true');
    });
  });

  it('hides the modal after Got it is tapped', async () => {
    const { getByTestId, queryByTestId } = render(<ArohaScreen />);

    await waitFor(() => getByTestId('aroha-intro-dismiss'));
    fireEvent.press(getByTestId('aroha-intro-dismiss'));

    // After dismiss, the button must leave the tree.
    await waitFor(() => {
      expect(queryByTestId('aroha-intro-dismiss')).toBeNull();
    });
  });
});
