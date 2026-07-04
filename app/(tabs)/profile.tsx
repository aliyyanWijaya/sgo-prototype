import AppText from "@/components/AppText";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import {
  getCurrentTier,
  getNextTier,
  getPointsToNextTier,
  MOCK_REWARDS,
  REWARD_TIERS,
  TIER_COLORS,
} from "@/data/rewards";
import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { MEMBER_DATA_KEY } from "@/utils/membership";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
const BRAND = "#2B7A77";

const TIER_DETAILS = {
  Bronze: {
    minPoints: 0,
    benefits: ["Access to member promotions", "5% cashback rewards"],
  },

  Silver: {
    minPoints: 500,
    benefits: ["10% cashback rewards", "Early access to deals"],
  },

  Gold: {
    minPoints: 1000,
    benefits: [
      "15% cashback rewards",
      "Priority customer support",
      "Exclusive partner offers",
    ],
  },

  Platinum: {
    minPoints: 2000,
    benefits: [
      "20% cashback rewards",
      "VIP event invitations",
      "Premium customer support",
    ],
  },

  "Kiwi Elite": {
    minPoints: 3500,
    benefits: [
      "25% cashback rewards",
      "Dedicated account support",
      "Exclusive national events",
      "Highest membership privileges",
    ],
  },
};

type SettingRowProps = {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  scale: (n: number) => number;
  testID?: string;
};

function SettingRow({
  label,
  description,
  value,
  onValueChange,
  scale,
  testID,
}: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <AppText style={[styles.settingLabel, { fontSize: scale(17) }]}>
          {label}
        </AppText>
        <AppText style={[styles.settingDesc, { fontSize: scale(14) }]}>
          {description}
        </AppText>
      </View>
      <Switch
        testID={testID}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#D1D5DB", true: BRAND }}
        thumbColor="#FFFFFF"
        accessibilityRole="switch"
        accessibilityLabel={label}
      />
    </View>
  );
}

export default function ProfileScreen() {
  const {
    memberName,
    notifications,
    shareLocation,
    largerText,
    setPreference,
    resetPreferences,
    scale,
  } = useUserPreferences();
  const { user } = useAuth();
  const displayName = user?.displayName || memberName || "Traveller";
  const initial = displayName[0].toUpperCase();
  const { resetOnboarding } = useOnboarding();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [tempName, setTempName] = useState(displayName);

  const openEditModal = () => {
    setTempName(displayName);
    setEditModalVisible(true);
  };

  const handleSaveName = () => {
    if (!tempName.trim()) return;
    setPreference("memberName", tempName.trim());
    setEditModalVisible(false);
  };

  const handleReset = () => {
    const doReset = async () => {
      await resetPreferences();
      await resetOnboarding();
      await AsyncStorage.multiRemove([MEMBER_DATA_KEY, "aroha_intro_seen"]);
      router.replace("/onboarding");
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "This will clear your profile, preferences, and membership card, then restart onboarding. Continue?",
      );
      if (confirmed) doReset();
    } else {
      Alert.alert(
        "Reset Onboarding",
        "This will clear your profile, preferences, and membership card, then restart onboarding. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Reset", style: "destructive", onPress: doReset },
        ],
      );
    }
  };

  const currentTier = getCurrentTier(MOCK_REWARDS.points);
  const nextTier = getNextTier(MOCK_REWARDS.points);
  const pointsToNextTier = getPointsToNextTier(MOCK_REWARDS.points);

  const [selectedTier, setSelectedTier] = useState(currentTier);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText style={[styles.heading, { fontSize: scale(26) }]}>
            Profile
          </AppText>
        </View>

        <View style={styles.memberCard}>
          <View style={styles.avatar}>
            <AppText style={[styles.avatarInitial, { fontSize: scale(30) }]}>
              {initial}
            </AppText>
          </View>
          <AppText style={[styles.memberName, { fontSize: scale(22) }]}>
            {displayName}
          </AppText>
          <AppText style={[styles.memberLabel, { fontSize: scale(14) }]}>
            SGO Member
          </AppText>

          <Pressable onPress={openEditModal} style={styles.editButton}>
            <AppText style={[styles.editButtonText, { fontSize: scale(14) }]}>
              Edit Profile
            </AppText>
          </Pressable>

          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [
              styles.demoButton,
              pressed && styles.demoButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Try onboarding again"
            accessibilityHint="Restarts the welcome and preferences setup"
          >
            <AppText style={[styles.demoButtonText, { fontSize: scale(14) }]}>
              🔄 Try Onboarding Again
            </AppText>
          </Pressable>
        </View>

        <View style={styles.section}>
          <AppText style={[styles.sectionTitle, { fontSize: scale(12) }]}>
            SMART REWARDS
          </AppText>
          <View style={styles.card}>
            <View style={styles.rewardsSummary}>
              <View>
                <AppText style={[styles.pointsValue, { fontSize: scale(30) }]}>
                  {MOCK_REWARDS.points.toLocaleString()}
                </AppText>
                <AppText style={[styles.pointsLabel, { fontSize: scale(13) }]}>
                  points balance
                </AppText>
              </View>
              <View
                style={[
                  styles.tierBadge,
                  { backgroundColor: TIER_COLORS[currentTier] },
                ]}
              >
                <AppText
                  style={[styles.tierBadgeText, { fontSize: scale(13) }]}
                >
                  {currentTier}
                </AppText>
              </View>
            </View>

            <View
              style={styles.tierBarRow}
              accessible
              accessibilityRole="progressbar"
              accessibilityLabel="Reward tier progress"
              accessibilityValue={{
                text: `${currentTier} tier, ${MOCK_REWARDS.points} points`,
              }}
            >
              {REWARD_TIERS.map((tier) => {
                const isCurrent = tier === currentTier;
                const isUnlocked =
                  REWARD_TIERS.indexOf(tier) <=
                  REWARD_TIERS.indexOf(currentTier);

                return (
                  <Pressable
                    key={tier}
                    style={styles.tierSegmentWrap}
                    onPress={() => setSelectedTier(tier)}
                    onHoverIn={() => setSelectedTier(tier)}
                  >
                    <View
                      style={[
                        styles.tierSegment,
                        {
                          backgroundColor: isUnlocked
                            ? TIER_COLORS[tier]
                            : "#E5E7EB",
                        },
                        isCurrent && styles.tierSegmentCurrent,
                      ]}
                    />

                    <AppText
                      style={[
                        styles.tierLabel,
                        { fontSize: scale(10) },
                        isCurrent && styles.tierLabelCurrent,
                      ]}
                      numberOfLines={1}
                    >
                      {tier}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            {selectedTier && (
              <View style={styles.tierInfoCard}>
                <View
                  style={[
                    styles.tierInfoBadge,
                    {
                      backgroundColor:
                        TIER_COLORS[selectedTier as keyof typeof TIER_COLORS],
                    },
                  ]}
                >
                  <AppText style={styles.tierInfoBadgeText}>
                    {selectedTier}
                  </AppText>
                </View>

                <AppText style={styles.tierInfoTitle}>Minimum Points</AppText>

                <AppText style={styles.tierInfoText}>
                  {TIER_DETAILS[
                    selectedTier as keyof typeof TIER_DETAILS
                  ].minPoints.toLocaleString()}{" "}
                  points
                </AppText>

                <AppText style={styles.tierInfoTitle}>Benefits</AppText>

                {TIER_DETAILS[
                  selectedTier as keyof typeof TIER_DETAILS
                ].benefits.map((benefit) => (
                  <AppText key={benefit} style={styles.tierInfoText}>
                    • {benefit}
                  </AppText>
                ))}
              </View>
            )}

            <AppText style={[styles.nextTierText, { fontSize: scale(14) }]}>
              {nextTier
                ? `${pointsToNextTier.toLocaleString()} points to ${nextTier}`
                : "You've reached the top tier!"}
            </AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={[styles.sectionTitle, { fontSize: scale(12) }]}>
            ACCESSIBILITY
          </AppText>
          <View style={styles.card}>
            <SettingRow
              label="Larger Text"
              description="Increase text size throughout the app"
              value={largerText}
              onValueChange={(v) => setPreference("largerText", v)}
              scale={scale}
              testID="toggle-larger-text-profile"
            />
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={[styles.sectionTitle, { fontSize: scale(12) }]}>
            APP SETTINGS
          </AppText>
          <View style={styles.card}>
            <SettingRow
              label="Notifications"
              description="Receive updates about nearby deals and events"
              value={notifications}
              onValueChange={(v) => setPreference("notifications", v)}
              scale={scale}
            />
            <View style={styles.divider} />
            <SettingRow
              label="Share Location"
              description="Help us find retailers near you"
              value={shareLocation}
              onValueChange={(v) => setPreference("shareLocation", v)}
              scale={scale}
            />
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText style={[styles.modalTitle, { fontSize: scale(18) }]}>
              Edit Name
            </AppText>
            <TextInput
              value={tempName}
              onChangeText={setTempName}
              style={[styles.modalInput, { fontSize: scale(16) }]}
              placeholder="Your name"
              autoFocus
            />
            <View style={styles.modalButtonRow}>
              <Pressable
                onPress={() => setEditModalVisible(false)}
                style={styles.modalCancelButton}
              >
                <AppText style={{ fontSize: scale(15) }}>Cancel</AppText>
              </Pressable>
              <Pressable
                onPress={handleSaveName}
                style={styles.modalSaveButton}
              >
                <AppText
                  style={{
                    fontSize: scale(15),
                    color: "#FFFFFF",
                    fontWeight: "600",
                  }}
                >
                  Save
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F0EB",
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
    fontWeight: "700",
    color: "#FFFFFF",
  },

  memberCard: {
    alignItems: "center",
    marginTop: -28,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 14,
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  memberName: {
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  memberLabel: {
    color: "#6B7280",
    fontWeight: "500",
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 64,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  settingDesc: {
    color: "#6B7280",
    lineHeight: 18,
  },

  rewardsSummary: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  pointsValue: {
    fontWeight: "700",
    color: "#111827",
  },
  pointsLabel: {
    color: "#6B7280",
    marginTop: 2,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tierBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  tierBarRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  tierSegmentWrap: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 3,
  },
  tierSegment: {
    height: 8,
    width: "100%",
    borderRadius: 4,
  },
  tierSegmentCurrent: {
    height: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  tierLabel: {
    color: "#9CA3AF",
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
  },
  tierLabelCurrent: {
    color: "#111827",
    fontWeight: "700",
  },
  tierInfoCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  tierInfoBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 10,
  },

  tierInfoBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  tierInfoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
    marginBottom: 4,
  },

  tierInfoText: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 4,
  },
  nextTierText: {
    color: "#374151",
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  editButton: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BRAND,
  },
  editButtonText: {
    color: BRAND,
    fontWeight: "600",
  },
  demoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  demoButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  demoButtonText: {
    color: "#4338CA",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "85%",
  },
  modalTitle: {
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalSaveButton: {
    backgroundColor: BRAND,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
