import { Feather } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/AppText";
import { useUserPreferences } from "@/context/UserPreferencesContext";
const BRAND = "#2B7A77";

type EventCategory = "walk" | "market" | "culture" | "social" | "health";

type LocalEvent = {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  description: string;
};

const CATEGORY_META: Record<
  EventCategory,
  { label: string; icon: keyof typeof Feather.glyphMap; color: string }
> = {
  walk: { label: "Walking Group", icon: "map", color: "#0F766E" },
  market: { label: "Market", icon: "shopping-bag", color: "#92400E" },
  culture: { label: "Culture", icon: "music", color: "#7C3AED" },
  social: { label: "Social Club", icon: "users", color: "#1E40AF" },
  health: { label: "Health & Wellbeing", icon: "heart", color: "#BE123C" },
};

const EVENTS: LocalEvent[] = [
  {
    id: "1",
    title: "Morning Walking Group",
    category: "walk",
    date: "Every Tuesday & Thursday",
    time: "8:30 AM – 9:30 AM",
    location: "Hamilton Gardens, main entrance",
    description:
      "A gentle, guided walk around the gardens. All fitness levels welcome — walk at your own pace with friendly company.",
  },
  {
    id: "2",
    title: "Farmers Market",
    category: "market",
    date: "Every Saturday",
    time: "8:00 AM – 12:00 PM",
    location: "Hamilton Farmers Market, Claudelands",
    description:
      "Fresh local produce, baked goods, and a chance to chat with growers. SGO members get a free coffee at participating stalls.",
  },
  {
    id: "3",
    title: "Afternoon Tea & Live Music",
    category: "culture",
    date: "First Sunday of the month",
    time: "2:00 PM – 4:00 PM",
    location: "Waikato Museum Café",
    description:
      "Relax with a cuppa while local musicians play familiar tunes. A lovely way to spend a quiet Sunday afternoon.",
  },
  {
    id: "4",
    title: "Cards & Board Games Club",
    category: "social",
    date: "Every Wednesday",
    time: "1:00 PM – 3:30 PM",
    location: "Hamilton East Community Hall",
    description:
      "Bridge, euchre, or just a friendly chat over a puzzle. New faces are always welcome — no experience needed.",
  },
  {
    id: "5",
    title: "Free Hearing & Balance Checks",
    category: "health",
    date: "15 July 2026",
    time: "10:00 AM – 2:00 PM",
    location: "Hamilton City Library",
    description:
      "Drop-in health checks run by local health providers. No appointment needed — just come along.",
  },
  {
    id: "6",
    title: "Garden & Craft Swap",
    category: "social",
    date: "Last Friday of the month",
    time: "10:00 AM – 12:00 PM",
    location: "Rotary Peace Garden",
    description:
      "Bring along plant cuttings, seeds, or craft supplies to share and swap with fellow green thumbs.",
  },
];

function EventCard({
  event,
  scale,
}: {
  event: LocalEvent;
  scale: (n: number) => number;
}) {
  const meta = CATEGORY_META[event.category];
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

      <AppText style={[styles.eventTitle, { fontSize: scale(19) }]}>
        {event.title}
      </AppText>

      <View style={styles.detailRow}>
        <Feather name="calendar" size={16} color="#6B7280" />
        <AppText style={[styles.detailText, { fontSize: scale(14) }]}>
          {event.date}
        </AppText>
      </View>
      <View style={styles.detailRow}>
        <Feather name="clock" size={16} color="#6B7280" />
        <AppText style={[styles.detailText, { fontSize: scale(14) }]}>
          {event.time}
        </AppText>
      </View>
      <View style={styles.detailRow}>
        <Feather name="map-pin" size={16} color="#6B7280" />
        <AppText style={[styles.detailText, { fontSize: scale(14) }]}>
          {event.location}
        </AppText>
      </View>

      <AppText style={[styles.eventDescription, { fontSize: scale(14) }]}>
        {event.description}
      </AppText>
    </View>
  );
}

export default function WhatsOnScreen() {
  const { scale } = useUserPreferences();

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText style={[styles.label, { fontSize: scale(24) }]}>
            What's On
          </AppText>
          <AppText style={[styles.sub, { fontSize: scale(15) }]}>
            Local events and activities near you
          </AppText>
        </View>

        <View style={styles.eventsList}>
          {EVENTS.map((event) => (
            <EventCard key={event.id} event={event} scale={scale} />
          ))}
        </View>

        <View style={styles.footerNote}>
          <Feather name="info" size={16} color={BRAND} />
          <AppText style={[styles.footerNoteText, { fontSize: scale(13) }]}>
            Events are updated weekly. Contact the venue directly to confirm
            details before attending.
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
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  label: {
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  sub: {
    color: "#6B7280",
  },
  eventsList: {
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
  eventTitle: {
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  detailText: {
    color: "#374151",
  },
  eventDescription: {
    color: "#4B5563",
    lineHeight: 21,
    marginTop: 10,
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: "rgba(43, 122, 119, 0.08)",
    borderRadius: 12,
    padding: 14,
  },
  footerNoteText: {
    flex: 1,
    color: "#374151",
    lineHeight: 19,
  },
});
