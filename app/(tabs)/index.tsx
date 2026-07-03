import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUserPreferences } from "@/context/UserPreferencesContext";

type Tile = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  iconBg: string;
  onPress: () => void;
};

export default function HomeScreen() {
  const { memberName, scale } = useUserPreferences();
  const displayName = memberName || "Traveller";

  const handleSosPress = () => {
    const showHelpConfirmation = () => {
      if (Platform.OS === "web") {
        window.alert(
          "Help is on the way. Emergency contact would be notified.",
        );
      } else {
        Alert.alert(
          "Help is on the way",
          "Emergency contact would be notified",
        );
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm("Do you need emergency help?");
      if (confirmed) showHelpConfirmation();
    } else {
      Alert.alert(
        "Emergency SOS",
        "Do you need emergency help?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Call for Help",
            style: "destructive",
            onPress: showHelpConfirmation,
          },
        ],
        { cancelable: true },
      );
    }
  };

  const tiles: Tile[] = [
    {
      id: "retailers",
      title: "Nearby Retailers",
      description: "Find shops and discounts around you",
      icon: "map-pin",
      iconBg: "#0F766E",
      onPress: () => router.navigate("/(tabs)/map"),
    },
    {
      id: "whats-on",
      title: "What's On",
      description: "Local events and activities",
      icon: "calendar",
      iconBg: "#92400E",
      onPress: () => router.push("/whats-on"),
    },
    {
      id: "good-to-know",
      title: "Good to Know",
      description: "Travel tips and useful information",
      icon: "info",
      iconBg: "#1E40AF",
      onPress: () => router.push("/good-to-know"),
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={[styles.logoText, { fontSize: scale(20) }]}>SGO</Text>
        <Pressable
          style={({ pressed }) => [
            styles.sosButton,
            pressed && styles.sosButtonPressed,
          ]}
          onPress={handleSosPress}
          accessibilityRole="button"
          accessibilityLabel="Emergency SOS"
          accessibilityHint="Shows options to call for emergency help"
        >
          <Feather name="alert-circle" size={20} color="#FFFFFF" />
          <Text style={[styles.sosLabel, { fontSize: scale(15) }]}>SOS</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { fontSize: scale(18) }]}>
            Welcome back,
          </Text>
          <Text style={[styles.name, { fontSize: scale(30) }]}>
            {displayName}
          </Text>
          <Text style={[styles.subtitle, { fontSize: scale(16) }]}>
            Ready to explore?
          </Text>
        </View>

        <View style={styles.tilesContainer}>
          {tiles.map((tile) => (
            <Pressable
              key={tile.id}
              style={({ pressed }) => [
                styles.tile,
                pressed && styles.tilePressed,
              ]}
              onPress={tile.onPress}
              accessibilityRole="button"
              accessibilityLabel={tile.title}
              accessibilityHint={tile.description}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: tile.iconBg }]}
              >
                <Feather name={tile.icon} size={26} color="#FFFFFF" />
              </View>
              <View style={styles.tileText}>
                <Text style={[styles.tileTitle, { fontSize: scale(19) }]}>
                  {tile.title}
                </Text>
                <Text style={[styles.tileDescription, { fontSize: scale(14) }]}>
                  {tile.description}
                </Text>
              </View>
              <Feather name="chevron-right" size={22} color="#9CA3AF" />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Floating action button — opens Aroha chat */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => router.push("/aroha")}
        accessibilityRole="button"
        accessibilityLabel="Ask Aroha for help"
        accessibilityHint="Opens Aroha, your SGO travel companion"
      >
        <Feather name="message-circle" size={26} color="#FFFFFF" />
        <Text style={[styles.fabLabel, { fontSize: scale(16) }]}>Aroha</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#2B7A77",
  },
  scroll: {
    flexGrow: 1,
    backgroundColor: "#F5F0EB",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 10,
  },
  logoText: {
    fontWeight: "800",
    color: "#2B7A77",
    letterSpacing: 0.5,
  },
  sosButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 48,
    minWidth: 64,
    backgroundColor: "#DC2626",
    borderRadius: 24,
    paddingHorizontal: 16,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sosButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  sosLabel: {
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  header: {
    backgroundColor: "#2B7A77",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
  },
  greeting: {
    fontSize: 18,
    color: "#CCF0EE",
    fontWeight: "400",
  },
  name: {
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#A7D9D7",
    marginTop: 6,
  },
  tilesContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 16,
  },
  tile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 16,
  },
  tilePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tileText: {
    flex: 1,
  },
  tileTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  tileDescription: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },

  // Aroha FAB
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1D6863",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  fabLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
