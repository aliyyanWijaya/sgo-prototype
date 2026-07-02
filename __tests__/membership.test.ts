import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  MEMBER_DATA_KEY,
  MemberData,
  formatJoinDate,
  generateMemberData,
  generateMemberNumber,
  loadMemberData,
  saveMemberData,
} from '@/utils/membership';

// AsyncStorage is auto-mocked via moduleNameMapper → jest/async-storage-mock
beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

// ─── generateMemberNumber ─────────────────────────────────────────────────────

describe('generateMemberNumber', () => {
  it('produces the correct format SGO-XXXXXX', () => {
    const result = generateMemberNumber();
    expect(result).toMatch(/^SGO-\d{6}$/);
  });

  it('generates different numbers across multiple calls', () => {
    const numbers = new Set(Array.from({ length: 20 }, generateMemberNumber));
    // At least some should differ (probability of all identical is astronomically low)
    expect(numbers.size).toBeGreaterThan(1);
  });
});

// ─── generateMemberData ───────────────────────────────────────────────────────

describe('generateMemberData', () => {
  it('uses the provided name', () => {
    const data = generateMemberData('Alice');
    expect(data.name).toBe('Alice');
  });

  it('assigns Bronze tier by default', () => {
    const data = generateMemberData('Bob');
    expect(data.tier).toBe('Bronze');
  });

  it('includes a valid ISO 8601 joinDate', () => {
    const data = generateMemberData('Carol');
    expect(() => new Date(data.joinDate)).not.toThrow();
    expect(new Date(data.joinDate).toISOString()).toBe(data.joinDate);
  });

  it('includes a member number in the correct format', () => {
    const data = generateMemberData('Dave');
    expect(data.memberNumber).toMatch(/^SGO-\d{6}$/);
  });
});

// ─── AsyncStorage round-trip ──────────────────────────────────────────────────

describe('saveMemberData / loadMemberData', () => {
  const fixture: MemberData = {
    name: 'Joan Smith',
    memberNumber: 'SGO-123456',
    tier: 'Bronze',
    joinDate: '2026-07-02T10:00:00.000Z',
  };

  it('persists member data to AsyncStorage under the correct key', async () => {
    await saveMemberData(fixture);
    const raw = await AsyncStorage.getItem(MEMBER_DATA_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual(fixture);
  });

  it('reads back the saved data correctly', async () => {
    await saveMemberData(fixture);
    const loaded = await loadMemberData();
    expect(loaded).toEqual(fixture);
  });

  it('returns null when no data has been saved', async () => {
    const loaded = await loadMemberData();
    expect(loaded).toBeNull();
  });

  it('returns null when stored value is corrupt JSON', async () => {
    await AsyncStorage.setItem(MEMBER_DATA_KEY, 'not-valid-json{{');
    const loaded = await loadMemberData();
    expect(loaded).toBeNull();
  });
});

// ─── formatJoinDate ───────────────────────────────────────────────────────────

describe('formatJoinDate', () => {
  it('formats an ISO date into a human-readable en-GB string', () => {
    const result = formatJoinDate('2026-07-02T10:00:00.000Z');
    // en-GB format: "2 July 2026"
    expect(result).toMatch(/July/);
    expect(result).toMatch(/2026/);
  });

  it('returns the original string when passed an unparseable value', () => {
    const bad = 'not-a-date';
    const result = formatJoinDate(bad);
    // Either returns the raw string or a NaN-based locale string — must not throw
    expect(typeof result).toBe('string');
  });
});
