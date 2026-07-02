import AsyncStorage from '@react-native-async-storage/async-storage';

export const MEMBER_DATA_KEY = 'member_data';

export type MemberTier = 'Bronze' | 'Silver' | 'Gold';

export interface MemberData {
  name: string;
  memberNumber: string; // format: SGO-XXXXXX
  tier: MemberTier;
  joinDate: string; // ISO 8601 date string
}

// Generates a member number in the format SGO-XXXXXX (6 random digits).
// Exported as a pure function so it can be unit-tested independently.
export function generateMemberNumber(): string {
  const digits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10));
  return `SGO-${digits.join('')}`;
}

export function generateMemberData(name: string): MemberData {
  return {
    name,
    memberNumber: generateMemberNumber(),
    tier: 'Bronze',
    joinDate: new Date().toISOString(),
  };
}

export async function saveMemberData(data: MemberData): Promise<void> {
  await AsyncStorage.setItem(MEMBER_DATA_KEY, JSON.stringify(data));
}

export async function loadMemberData(): Promise<MemberData | null> {
  const raw = await AsyncStorage.getItem(MEMBER_DATA_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MemberData;
  } catch {
    return null;
  }
}

export function formatJoinDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}
