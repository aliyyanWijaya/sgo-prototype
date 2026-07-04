import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/AppText";
import { useAuth } from "@/context/AuthContext";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { formatJoinDate, loadMemberData, MemberData } from "@/utils/membership";

const BRAND = "#2B7A77";
const CARD_BG = "#1D6863";

// ─── Membership Card ──────────────────────────────────────────────────────────

function MembershipCard({
  data,
  scale,
}: {
  data: MemberData;
  scale: (n: number) => number;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.decorCircleLarge} />
      <View style={styles.decorCircleSmall} />

      <View style={styles.cardTopRow}>
        <AppText style={[styles.cardBrand, { fontSize: scale(16) }]}>
          SavGoSpend
        </AppText>
        <View style={styles.offlineBadge}>
          <Feather name="wifi-off" size={11} color="#FFFFFF" />
          <AppText style={[styles.offlineBadgeText, { fontSize: scale(11) }]}>
            Available Offline
          </AppText>
        </View>
      </View>

      <View style={styles.cardMiddle}>
        <AppText
          style={[styles.cardName, { fontSize: scale(28) }]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {data.name}
        </AppText>
        <AppText
          style={[styles.cardNumber, { fontSize: scale(20) }]}
          accessibilityLabel={`Member number ${data.memberNumber.split("").join(" ")}`}
        >
          {data.memberNumber}
        </AppText>
      </View>

      <View style={styles.cardBottomRow}>
        <View>
          <View style={styles.tierBadge}>
            <AppText style={[styles.tierBadgeText, { fontSize: scale(11) }]}>
              {data.tier.toUpperCase()} MEMBER
            </AppText>
          </View>
          <AppText style={[styles.joinDate, { fontSize: scale(12) }]}>
            Member since {formatJoinDate(data.joinDate)}
          </AppText>
        </View>
        <View style={styles.sgoMark}>
          <AppText style={[styles.sgoMarkText, { fontSize: scale(12) }]}>
            SGO
          </AppText>
        </View>
      </View>
    </View>
  );
}

function GuestLockedCard({ scale }: { scale: (n: number) => number }) {
  const { signOut } = useAuth(); // tambahkan ini

  return (
    <View style={styles.lockedWrap}>
      <Feather name="lock" size={32} color={BRAND} />
      <AppText style={[styles.lockedTitle, { fontSize: scale(18) }]}>
        Member Card Locked
      </AppText>
      <AppText style={[styles.lockedText, { fontSize: scale(14) }]}>
        Sign in with Google to get your digital member card and unlock retailer
        discounts.
      </AppText>
      <Pressable
        style={styles.lockedButton}
        onPress={async () => {
          await signOut();
        }}
      >
        <AppText style={[styles.lockedButtonText, { fontSize: scale(15) }]}>
          Sign In
        </AppText>
      </Pressable>
    </View>
  );
}

// ─── Fallback (no data) ───────────────────────────────────────────────────────

function NoDataCard({ scale }: { scale: (n: number) => number }) {
  return (
    <View style={styles.noDataCard}>
      <View style={styles.noDataIconWrap}>
        <Feather name="credit-card" size={40} color="#9CA3AF" />
      </View>
      <AppText style={[styles.noDataTitle, { fontSize: scale(20) }]}>
        No membership card yet
      </AppText>
      <AppText style={[styles.noDataBody, { fontSize: scale(15) }]}>
        Complete the welcome setup to generate your membership card.
      </AppText>
    </View>
  );
}

// ─── Card Screen ──────────────────────────────────────────────────────────────

export default function CardScreen() {
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const { scale } = useUserPreferences();
  const { user, isGuest } = useAuth();

  useEffect(() => {
    if (isGuest) {
      setLoading(false);
      return;
    }
    loadMemberData().then((data) => {
      setMemberData(data);
      setLoading(false);
    });
  }, [isGuest]);

  const displayMemberData =
    memberData && user?.displayName
      ? { ...memberData, name: user.displayName }
      : memberData;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <AppText style={[styles.screenTitle, { fontSize: scale(26) }]}>
          Membership Card
        </AppText>
        <AppText style={[styles.screenSubtitle, { fontSize: scale(15) }]}>
          Your identity as an SGO member
        </AppText>

        {isGuest ? (
          <GuestLockedCard scale={scale} />
        ) : loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={BRAND} />
          </View>
        ) : displayMemberData ? (
          <>
            <MembershipCard data={displayMemberData} scale={scale} />
            <View style={styles.infoRow}>
              <Feather name="shield" size={16} color={BRAND} />
              <AppText style={[styles.infoText, { fontSize: scale(14) }]}>
                This card works without internet. Show it at any participating
                retailer.
              </AppText>
            </View>
          </>
        ) : (
          <NoDataCard scale={scale} />
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F0EB",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  screenTitle: {
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  screenSubtitle: {
    color: "#6B7280",
    marginBottom: 28,
  },

  card: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 28,
    minHeight: 216,
    shadowColor: CARD_BG,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
    overflow: "hidden",
    justifyContent: "space-between",
  },

  decorCircleLarge: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -60,
    right: -60,
  },
  decorCircleSmall: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -30,
    left: -20,
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardBrand: {
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.3,
  },

  offlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  offlineBadgeText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  cardMiddle: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 20,
  },
  cardName: {
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  cardNumber: {
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 3,
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
  },

  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  tierBadge: {
    backgroundColor: "rgba(217, 119, 6, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  tierBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 1,
  },
  joinDate: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  sgoMark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  sgoMarkText: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "800",
    letterSpacing: 1,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 24,
    backgroundColor: "rgba(43, 122, 119, 0.08)",
    borderRadius: 12,
    padding: 14,
  },
  infoText: {
    flex: 1,
    color: "#374151",
    lineHeight: 20,
  },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  noDataCard: {
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  noDataIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  noDataTitle: {
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
    textAlign: "center",
  },
  noDataBody: {
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  lockedWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 8,
  },
  lockedTitle: {
    fontWeight: "700",
    color: BRAND,
    marginTop: 4,
  },
  lockedText: {
    textAlign: "center",
    color: "#5A6670",
    lineHeight: 20,
  },
  lockedButton: {
    backgroundColor: BRAND,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 12,
  },
  lockedButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
