import AppText from "@/components/AppText";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BRAND = "#2B7A77";

type TipCategory = "safety" | "accessibility" | "app" | "travel";
type FilterValue = "all" | TipCategory;

type Tip = {
  id: string;
  title: string;
  category: TipCategory;
  body: string;
};

type CategoryMeta = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
};

const CATEGORY_META: Record<TipCategory, CategoryMeta> = {
  safety: { label: "Safety", icon: "shield", color: "#BE123C" },
  accessibility: { label: "Accessibility", icon: "eye", color: "#7C3AED" },
  app: { label: "Using SGO", icon: "smartphone", color: "#0F766E" },
  travel: { label: "Travel Tips", icon: "map", color: "#92400E" },
};

// Order controls how filter chips are displayed
const FILTER_ORDER: FilterValue[] = [
  "all",
  "safety",
  "accessibility",
  "app",
  "travel",
];

const TIPS: Tip[] = [
  {
    id: "1",
    title: "Using Your SOS Button",
    category: "safety",
    body: "The red SOS button on the Home screen is always one tap away. Press it if you ever feel unsafe or need urgent help — it will confirm before contacting your emergency contact.",
  },
  {
    id: "2",
    title: "Making Text Bigger",
    category: "accessibility",
    body: 'Go to Profile and turn on "Larger Text" to increase text size throughout the app. You can turn this on or off any time — it takes effect straight away.',
  },
  {
    id: "3",
    title: "Showing Your Membership Card",
    category: "app",
    body: "Your digital membership card works even without internet. Open the Card tab and show it to any participating retailer to receive your discount.",
  },
  {
    id: "4",
    title: "Finding Nearby Deals",
    category: "app",
    body: "The Map tab shows retailers near you offering SGO discounts. Tap any pin to see what discount is available and how to redeem it.",
  },
  {
    id: "5",
    title: "Travelling in Winter",
    category: "travel",
    body: "Footpaths can be slippery on cold mornings. Consider travelling after 10am when frost has cleared, and wear shoes with good grip.",
  },
  {
    id: "6",
    title: "Ask Aroha Anytime",
    category: "app",
    body: "Not sure how something works? Tap the Aroha button on Home and ask in your own words — she is there to help, day or night.",
  },
  {
    id: "7",
    title: "Keeping Your Phone Charged",
    category: "safety",
    body: "Before heading out for the day, make sure your phone is charged above 50%. Many cafés and libraries are happy to let you top up if needed.",
  },
  {
    id: "8",
    title: "Sharing Your Location",
    category: "accessibility",
    body: 'Turning on "Share Location" in Profile helps us show retailers and events closest to you. You can switch this off at any time — it is entirely your choice.',
  },
];

function TipCard({ tip, scale }: { tip: Tip; scale: (n: number) => number }) {
  const meta = CATEGORY_META[tip.category];
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={[styles.categoryBadge, { backgroundColor: meta.color }]}>
          <Feather name={meta.icon} size={14} color="#FFFFFF" />
          <AppText style={[styles.categoryBadgeText, { fontSize: scale(12) }]}>
            {meta.label}
          </AppText>
        </View>
      </View>
      <AppText style={[styles.tipTitle, { fontSize: scale(18) }]}>
        {tip.title}
      </AppText>
      <AppText style={[styles.tipBody, { fontSize: scale(14) }]}>
        {tip.body}
      </AppText>
    </View>
  );
}

function FilterChip({
  value,
  active,
  onPress,
  scale,
}: {
  value: FilterValue;
  active: boolean;
  onPress: () => void;
  scale: (n: number) => number;
}) {
  const isAll = value === "all";
  const meta = isAll ? null : CATEGORY_META[value];
  const label = isAll ? "All" : meta!.label;
  const icon = isAll ? "grid" : meta!.icon;
  const color = isAll ? BRAND : meta!.color;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active && { backgroundColor: color, borderColor: color },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Filter by ${label}`}
      accessibilityState={{ selected: active }}
    >
      <Feather name={icon} size={14} color={active ? "#FFFFFF" : color} />
      <AppText
        style={[
          styles.chipText,
          { fontSize: scale(13), color: active ? "#FFFFFF" : "#374151" },
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

export default function GoodToKnowScreen() {
  const { scale } = useUserPreferences();
  const [filter, setFilter] = useState<FilterValue>("all");

  const filteredTips = useMemo(
    () => (filter === "all" ? TIPS : TIPS.filter((t) => t.category === filter)),
    [filter],
  );

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.header}>
        <AppText style={[styles.label, { fontSize: scale(24) }]}>
          Good to Know
        </AppText>
        <AppText style={[styles.sub, { fontSize: scale(15) }]}>
          Helpful tips for getting the most out of SGO
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        {FILTER_ORDER.map((value) => (
          <FilterChip
            key={value}
            value={value}
            active={filter === value}
            onPress={() => setFilter(value)}
            scale={scale}
          />
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {filteredTips.length > 0 ? (
          <View style={styles.tipsList}>
            {filteredTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} scale={scale} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Feather name="search" size={32} color="#9CA3AF" />
            <AppText style={[styles.emptyStateText, { fontSize: scale(15) }]}>
              No tips in this category yet.
            </AppText>
          </View>
        )}

        <View style={styles.footerNote}>
          <Feather name="heart" size={16} color={BRAND} />
          <AppText style={[styles.footerNoteText, { fontSize: scale(13) }]}>
            {"Have a question that's not answered here? "}
            <AppText
              style={styles.footerNoteLink}
              onPress={() => router.push("/aroha")}
              accessibilityRole="link"
              accessibilityLabel="Ask Aroha"
            >
              Ask Aroha
            </AppText>
            {", or reach out to the SGO team anytime."}
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F0EB",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  label: {
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  sub: {
    color: "#6B7280",
  },

  filterScroll: {
    flexGrow: 0,
    marginBottom: 8,
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      web: { outlineStyle: "none" } as any,
    }),
  },
  chipText: {
    fontWeight: "600",
  },

  scroll: {
    flexGrow: 1,
    paddingTop: 12,
    paddingBottom: 40,
  },
  tipsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  tipTitle: {
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  tipBody: {
    color: "#4B5563",
    lineHeight: 21,
  },

  emptyState: {
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyStateText: {
    color: "#6B7280",
    textAlign: "center",
  },

  footerNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "rgba(43, 122, 119, 0.08)",
    borderRadius: 12,
    padding: 14,
  },
  footerNoteText: {
    flex: 1,
    color: "#374151",
    lineHeight: 19,
  },
  footerNoteLink: {
    color: BRAND,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
