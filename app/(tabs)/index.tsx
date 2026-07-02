import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserPreferences } from '@/context/UserPreferencesContext';

type Tile = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  iconBg: string;
  onPress: () => void;
};

export default function HomeScreen() {
  const { memberName } = useUserPreferences();
  const displayName = memberName || 'Traveller';

  const tiles: Tile[] = [
    {
      id: 'retailers',
      title: 'Nearby Retailers',
      description: 'Find shops and discounts around you',
      icon: 'map-pin',
      iconBg: '#0F766E',
      onPress: () => router.navigate('/(tabs)/map'),
    },
    {
      id: 'whats-on',
      title: "What's On",
      description: 'Local events and activities',
      icon: 'calendar',
      iconBg: '#92400E',
      onPress: () => router.push('/whats-on'),
    },
    {
      id: 'good-to-know',
      title: 'Good to Know',
      description: 'Travel tips and useful information',
      icon: 'info',
      iconBg: '#1E40AF',
      onPress: () => router.push('/good-to-know'),
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.subtitle}>Ready to explore?</Text>
        </View>

        <View style={styles.tilesContainer}>
          {tiles.map((tile) => (
            <Pressable
              key={tile.id}
              style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
              onPress={tile.onPress}
              accessibilityRole="button"
              accessibilityLabel={tile.title}
              accessibilityHint={tile.description}>
              <View style={[styles.iconContainer, { backgroundColor: tile.iconBg }]}>
                <Feather name={tile.icon} size={26} color="#FFFFFF" />
              </View>
              <View style={styles.tileText}>
                <Text style={styles.tileTitle}>{tile.title}</Text>
                <Text style={styles.tileDescription}>{tile.description}</Text>
              </View>
              <Feather name="chevron-right" size={22} color="#9CA3AF" />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Floating action button — opens Aroha chat */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => router.push('/aroha')}
        accessibilityRole="button"
        accessibilityLabel="Ask Aroha for help"
        accessibilityHint="Opens Aroha, your SGO travel companion">
        <Feather name="message-circle" size={26} color="#FFFFFF" />
        <Text style={styles.fabLabel}>Aroha</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#2B7A77',
  },
  scroll: {
    flexGrow: 1,
    backgroundColor: '#F5F0EB',
  },
  header: {
    backgroundColor: '#2B7A77',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
  },
  greeting: {
    fontSize: 18,
    color: '#CCF0EE',
    fontWeight: '400',
  },
  name: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#A7D9D7',
    marginTop: 6,
  },
  tilesContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 16,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
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
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tileText: {
    flex: 1,
  },
  tileTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  tileDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },

  // Aroha FAB
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1D6863',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#000',
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
