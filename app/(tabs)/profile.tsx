import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserPreferences } from '@/context/UserPreferencesContext';
import {
  getCurrentTier,
  getNextTier,
  getPointsToNextTier,
  MOCK_REWARDS,
  REWARD_TIERS,
  TIER_COLORS,
} from '@/data/rewards';

const BRAND = '#2B7A77';

type SettingRowProps = {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  scale: (n: number) => number;
  testID?: string;
};

function SettingRow({ label, description, value, onValueChange, scale, testID }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, { fontSize: scale(17) }]}>{label}</Text>
        <Text style={[styles.settingDesc, { fontSize: scale(14) }]}>{description}</Text>
      </View>
      <Switch
        testID={testID}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D5DB', true: BRAND }}
        thumbColor="#FFFFFF"
        accessibilityRole="switch"
        accessibilityLabel={label}
      />
    </View>
  );
}

export default function ProfileScreen() {
  const { memberName, notifications, shareLocation, largerText, setPreference, scale } =
    useUserPreferences();
  const displayName = memberName || 'Traveller';
  const initial = displayName[0].toUpperCase();

  const currentTier = getCurrentTier(MOCK_REWARDS.points);
  const nextTier = getNextTier(MOCK_REWARDS.points);
  const pointsToNextTier = getPointsToNextTier(MOCK_REWARDS.points);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.heading, { fontSize: scale(26) }]}>Profile</Text>
        </View>

        <View style={styles.memberCard}>
          <View style={styles.avatar}>
            <Text style={[styles.avatarInitial, { fontSize: scale(30) }]}>{initial}</Text>
          </View>
          <Text style={[styles.memberName, { fontSize: scale(22) }]}>{displayName}</Text>
          <Text style={[styles.memberLabel, { fontSize: scale(14) }]}>SGO Member</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: scale(12) }]}>SMART REWARDS</Text>
          <View style={styles.card}>
            <View style={styles.rewardsSummary}>
              <View>
                <Text style={[styles.pointsValue, { fontSize: scale(30) }]}>
                  {MOCK_REWARDS.points.toLocaleString()}
                </Text>
                <Text style={[styles.pointsLabel, { fontSize: scale(13) }]}>points balance</Text>
              </View>
              <View style={[styles.tierBadge, { backgroundColor: TIER_COLORS[currentTier] }]}>
                <Text style={[styles.tierBadgeText, { fontSize: scale(13) }]}>{currentTier}</Text>
              </View>
            </View>

            <View
              style={styles.tierBarRow}
              accessible
              accessibilityRole="progressbar"
              accessibilityLabel="Reward tier progress"
              accessibilityValue={{ text: `${currentTier} tier, ${MOCK_REWARDS.points} points` }}
            >
              {REWARD_TIERS.map((tier) => {
                const isCurrent = tier === currentTier;
                const isUnlocked =
                  REWARD_TIERS.indexOf(tier) <= REWARD_TIERS.indexOf(currentTier);
                return (
                  <View key={tier} style={styles.tierSegmentWrap}>
                    <View
                      style={[
                        styles.tierSegment,
                        { backgroundColor: isUnlocked ? TIER_COLORS[tier] : '#E5E7EB' },
                        isCurrent && styles.tierSegmentCurrent,
                      ]}
                    />
                    <Text
                      style={[
                        styles.tierLabel,
                        { fontSize: scale(10) },
                        isCurrent && styles.tierLabelCurrent,
                      ]}
                      numberOfLines={1}
                      allowFontScaling
                    >
                      {tier}
                    </Text>
                  </View>
                );
              })}
            </View>

            <Text style={[styles.nextTierText, { fontSize: scale(14) }]}>
              {nextTier
                ? `${pointsToNextTier.toLocaleString()} points to ${nextTier}`
                : "You've reached the top tier!"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: scale(12) }]}>ACCESSIBILITY</Text>
          <View style={styles.card}>
            <SettingRow
              label="Larger Text"
              description="Increase text size throughout the app"
              value={largerText}
              onValueChange={(v) => setPreference('largerText', v)}
              scale={scale}
              testID="toggle-larger-text-profile"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: scale(12) }]}>APP SETTINGS</Text>
          <View style={styles.card}>
            <SettingRow
              label="Notifications"
              description="Receive updates about nearby deals and events"
              value={notifications}
              onValueChange={(v) => setPreference('notifications', v)}
              scale={scale}
            />
            <View style={styles.divider} />
            <SettingRow
              label="Share Location"
              description="Help us find retailers near you"
              value={shareLocation}
              onValueChange={(v) => setPreference('shareLocation', v)}
              scale={scale}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
  scroll: {
    paddingBottom: 48,
  },

  header: {
    backgroundColor: BRAND,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  heading: {
    fontWeight: '700',
    color: '#FFFFFF',
  },

  memberCard: {
    alignItems: 'center',
    marginTop: -28,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BRAND,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  memberName: {
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  memberLabel: {
    color: '#6B7280',
    fontWeight: '500',
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 64,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingDesc: {
    color: '#6B7280',
    lineHeight: 18,
  },

  rewardsSummary: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  pointsValue: {
    fontWeight: '700',
    color: '#111827',
  },
  pointsLabel: {
    color: '#6B7280',
    marginTop: 2,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tierBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tierBarRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  tierSegmentWrap: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  tierSegment: {
    height: 8,
    width: '100%',
    borderRadius: 4,
  },
  tierSegmentCurrent: {
    height: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  tierLabel: {
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  tierLabelCurrent: {
    color: '#111827',
    fontWeight: '700',
  },
  nextTierText: {
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
});
