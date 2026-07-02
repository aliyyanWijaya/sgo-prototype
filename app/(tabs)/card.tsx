import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MemberData, formatJoinDate, loadMemberData } from '@/utils/membership';

const BRAND = '#2B7A77';
const CARD_BG = '#1D6863';
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 40;

// ─── Membership Card ──────────────────────────────────────────────────────────

function MembershipCard({ data }: { data: MemberData }) {
  return (
    <View style={styles.card}>
      {/* Decorative background circles for physical-card feel */}
      <View style={styles.decorCircleLarge} />
      <View style={styles.decorCircleSmall} />

      {/* Top row: brand name + offline badge */}
      <View style={styles.cardTopRow}>
        <Text style={styles.cardBrand}>SavGoSpend</Text>
        <View style={styles.offlineBadge}>
          <Feather name="wifi-off" size={11} color="#FFFFFF" />
          <Text style={styles.offlineBadgeText}>Available Offline</Text>
        </View>
      </View>

      {/* Member name + number — large for low-vision readability */}
      <View style={styles.cardMiddle}>
        <Text style={styles.cardName} numberOfLines={2} adjustsFontSizeToFit>
          {data.name}
        </Text>
        <Text style={styles.cardNumber} accessibilityLabel={`Member number ${data.memberNumber.split('').join(' ')}`}>
          {data.memberNumber}
        </Text>
      </View>

      {/* Bottom row: tier + join date */}
      <View style={styles.cardBottomRow}>
        <View>
          <View style={styles.tierBadge}>
            <Text style={styles.tierBadgeText}>{data.tier.toUpperCase()} MEMBER</Text>
          </View>
          <Text style={styles.joinDate}>
            Member since {formatJoinDate(data.joinDate)}
          </Text>
        </View>
        <View style={styles.sgoMark}>
          <Text style={styles.sgoMarkText}>SGO</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Fallback (no data) ───────────────────────────────────────────────────────

function NoDataCard() {
  return (
    <View style={styles.noDataCard}>
      <View style={styles.noDataIconWrap}>
        <Feather name="credit-card" size={40} color="#9CA3AF" />
      </View>
      <Text style={styles.noDataTitle}>No membership card yet</Text>
      <Text style={styles.noDataBody}>
        Complete the welcome setup to generate your membership card.
      </Text>
    </View>
  );
}

// ─── Card Screen ──────────────────────────────────────────────────────────────

export default function CardScreen() {
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemberData().then((data) => {
      setMemberData(data);
      setLoading(false);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Membership Card</Text>
        <Text style={styles.screenSubtitle}>Your identity as an SGO member</Text>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={BRAND} />
          </View>
        ) : memberData ? (
          <>
            <MembershipCard data={memberData} />
            <View style={styles.infoRow}>
              <Feather name="shield" size={16} color={BRAND} />
              <Text style={styles.infoText}>
                This card works without internet. Show it at any participating retailer.
              </Text>
            </View>
          </>
        ) : (
          <NoDataCard />
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  // Screen header
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 28,
  },

  // The physical card
  card: {
    width: CARD_WIDTH,
    backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 28,
    minHeight: 216,
    shadowColor: CARD_BG,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },

  // Decorative circles
  decorCircleLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -60,
    right: -60,
  },
  decorCircleSmall: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -30,
    left: -20,
  },

  // Card sections
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.3,
  },

  // Available Offline badge
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  offlineBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  // Member name and number
  cardMiddle: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
  },
  cardName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 3,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },

  // Tier + join date
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  tierBadge: {
    backgroundColor: 'rgba(217, 119, 6, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  tierBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  joinDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  sgoMark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sgoMarkText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Info strip below card
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 24,
    backgroundColor: 'rgba(43, 122, 119, 0.08)',
    borderRadius: 12,
    padding: 14,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },

  // Loading
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // No data fallback
  noDataCard: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  noDataIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
  },
  noDataBody: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});
