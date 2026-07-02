import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserPreferences } from '@/context/UserPreferencesContext';

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
});
