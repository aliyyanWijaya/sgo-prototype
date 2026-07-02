export type RewardTier =
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Kiwi Elite";

export const REWARD_TIERS: RewardTier[] = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Kiwi Elite",
];

/** Points required to reach each tier (index-aligned with REWARD_TIERS) */
export const TIER_THRESHOLDS: Record<RewardTier, number> = {
  Bronze: 0,
  Silver: 500,
  Gold: 1000,
  Platinum: 2000,
  "Kiwi Elite": 3500,
};

export const TIER_COLORS: Record<RewardTier, string> = {
  Bronze: "#B08D57",
  Silver: "#9CA3AF",
  Gold: "#D4AF37",
  Platinum: "#7C93A8",
  "Kiwi Elite": "#2B7A77",
};

/** Mock member rewards balance — no backend, static for prototype purposes */
export const MOCK_REWARDS = {
  points: 3500,
} as const;

export function getCurrentTier(points: number): RewardTier {
  let current: RewardTier = REWARD_TIERS[0];
  for (const tier of REWARD_TIERS) {
    if (points >= TIER_THRESHOLDS[tier]) {
      current = tier;
    }
  }
  return current;
}

export function getNextTier(points: number): RewardTier | null {
  const current = getCurrentTier(points);
  const currentIndex = REWARD_TIERS.indexOf(current);
  return currentIndex < REWARD_TIERS.length - 1
    ? REWARD_TIERS[currentIndex + 1]
    : null;
}

/** Points still needed to reach the next tier, or 0 if already at the top tier */
export function getPointsToNextTier(points: number): number {
  const nextTier = getNextTier(points);
  return nextTier ? TIER_THRESHOLDS[nextTier] - points : 0;
}
