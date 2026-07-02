import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserPreferences } from '@/context/UserPreferencesContext';
import {
  CATEGORY_COLORS,
  HAMILTON_CENTER,
  RETAILERS,
  Retailer,
} from '@/data/retailers';

// react-native-maps is native-only. Import lazily so the module isn't evaluated
// on web (where it would throw) and so Jest tests that don't render this screen
// don't need a mock.
let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
}

const BRAND = '#2B7A77';
type ViewMode = 'map' | 'list';

// ─── View toggle ──────────────────────────────────────────────────────────────

function ViewToggle({
  active,
  onSwitch,
}: {
  active: ViewMode;
  onSwitch: (m: ViewMode) => void;
}) {
  return (
    <View style={styles.toggleTrack}>
      {(['map', 'list'] as ViewMode[]).map((mode) => (
        <Pressable
          key={mode}
          style={[styles.toggleBtn, active === mode && styles.toggleBtnActive]}
          onPress={() => onSwitch(mode)}
          accessibilityRole="button"
          accessibilityLabel={mode === 'map' ? 'Map view' : 'List view'}
          accessibilityState={{ selected: active === mode }}>
          <Feather
            name={mode === 'map' ? 'map' : 'list'}
            size={17}
            color={active === mode ? '#FFFFFF' : BRAND}
          />
          <Text
            style={[styles.toggleText, active === mode && styles.toggleTextActive]}>
            {mode === 'map' ? 'Map View' : 'List View'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ─── Retailer card — used in list view ────────────────────────────────────────

function RetailerListCard({
  retailer,
  onPress,
  scale,
}: {
  retailer: Retailer;
  onPress: () => void;
  scale: (n: number) => number;
}) {
  const catColor = CATEGORY_COLORS[retailer.category];
  return (
    <Pressable
      style={({ pressed }) => [styles.listCard, pressed && styles.listCardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${retailer.name}, ${retailer.distance}`}>
      {/* Left colour accent bar */}
      <View style={[styles.listCardBar, { backgroundColor: catColor }]} />

      <View style={styles.listCardBody}>
        {/* Top row: name + category badge */}
        <View style={styles.listCardTopRow}>
          <Text
            style={[styles.listCardName, { fontSize: scale(18) }]}
            numberOfLines={1}>
            {retailer.name}
          </Text>
          <View style={[styles.catBadge, { backgroundColor: `${catColor}22` }]}>
            <Text style={[styles.catBadgeText, { color: catColor, fontSize: scale(11) }]}>
              {retailer.category}
            </Text>
          </View>
        </View>

        {/* Distance + discount */}
        <View style={styles.listMetaRow}>
          <Feather name="map-pin" size={13} color="#6B7280" />
          <Text style={[styles.metaText, { fontSize: scale(13) }]}>
            {retailer.distance}
          </Text>
          {retailer.discountAvailable && (
            <View style={styles.discountBadge}>
              <Feather name="tag" size={11} color="#047857" />
              <Text style={[styles.discountText, { fontSize: scale(11) }]}>Discount</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <Text
          style={[styles.listCardDesc, { fontSize: scale(14) }]}
          numberOfLines={2}>
          {retailer.description}
        </Text>
      </View>
    </Pressable>
  );
}

// ─── Retailer detail bottom sheet ─────────────────────────────────────────────

function RetailerSheet({
  retailer,
  onClose,
  scale,
}: {
  retailer: Retailer;
  onClose: () => void;
  scale: (n: number) => number;
}) {
  const catColor = CATEGORY_COLORS[retailer.category];
  return (
    <View style={sheet.card} onStartShouldSetResponder={() => true}>
      {/* Drag handle */}
      <View style={sheet.handle} />

      {/* Badges */}
      <View style={sheet.badgeRow}>
        <View style={[sheet.catBadge, { backgroundColor: `${catColor}22` }]}>
          <Text style={[sheet.catBadgeText, { color: catColor, fontSize: scale(13) }]}>
            {retailer.category}
          </Text>
        </View>
        {retailer.discountAvailable && (
          <View style={sheet.discountBadge}>
            <Feather name="tag" size={14} color="#047857" />
            <Text style={[sheet.discountText, { fontSize: scale(13) }]}>
              Discount available
            </Text>
          </View>
        )}
      </View>

      {/* Name */}
      <Text style={[sheet.name, { fontSize: scale(24) }]}>{retailer.name}</Text>

      {/* Distance */}
      <View style={sheet.metaRow}>
        <Feather name="map-pin" size={16} color="#6B7280" />
        <Text style={[sheet.metaText, { fontSize: scale(15) }]}>{retailer.distance}</Text>
      </View>

      {/* Description */}
      <Text style={[sheet.description, { fontSize: scale(16) }]}>
        {retailer.description}
      </Text>

      {/* Close */}
      <Pressable
        style={({ pressed }) => [sheet.closeBtn, pressed && sheet.closeBtnPressed]}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close retailer details">
        <Text style={[sheet.closeBtnText, { fontSize: scale(17) }]}>Close</Text>
      </Pressable>
    </View>
  );
}

// ─── Web fallback ─────────────────────────────────────────────────────────────

function WebMapFallback({ onShowList }: { onShowList: () => void }) {
  return (
    <View style={styles.webFallback}>
      <Feather name="map" size={52} color="#9CA3AF" />
      <Text style={styles.webFallbackTitle}>Map not available on web</Text>
      <Text style={styles.webFallbackBody}>
        Open the iOS or Android app to see retailers on the map.
      </Text>
      <Pressable style={styles.webFallbackBtn} onPress={onShowList}>
        <Text style={styles.webFallbackBtnText}>Switch to List View</Text>
      </Pressable>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MapScreen() {
  const { scale } = useUserPreferences();
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selected, setSelected] = useState<Retailer | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { fontSize: scale(22) }]}>
          Nearby Retailers
        </Text>
        <ViewToggle active={viewMode} onSwitch={setViewMode} />
      </View>

      {/* ── Content ── */}
      {viewMode === 'map' ? (
        Platform.OS === 'web' ? (
          <WebMapFallback onShowList={() => setViewMode('list')} />
        ) : (
          <MapView
            style={styles.map}
            initialRegion={HAMILTON_CENTER}
            showsUserLocation={false}
            showsMyLocationButton={false}
            // Uses Apple Maps on iOS, default provider on Android.
            // For Android production builds, add a Google Maps API key via
            // expo-build-properties or the react-native-maps config plugin.
          >
            {RETAILERS.map((r) => (
              <Marker
                key={r.id}
                coordinate={r.coordinate}
                title={r.name}
                description={r.distance}
                pinColor={CATEGORY_COLORS[r.category]}
                onPress={() => setSelected(r)}
              />
            ))}
          </MapView>
        )
      ) : (
        <FlatList
          data={RETAILERS}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <RetailerListCard
              retailer={item}
              onPress={() => setSelected(item)}
              scale={scale}
            />
          )}
        />
      )}

      {/* ── Retailer detail sheet ── */}
      {selected && (
        <Modal
          visible
          transparent
          animationType="slide"
          statusBarTranslucent
          onRequestClose={() => setSelected(null)}>
          <Pressable style={sheet.backdrop} onPress={() => setSelected(null)}>
            <RetailerSheet
              retailer={selected}
              onClose={() => setSelected(null)}
              scale={scale}
            />
          </Pressable>
        </Modal>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F0EB',
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: '#F5F0EB',
  },
  screenTitle: {
    fontWeight: '700',
    color: '#111827',
  },

  // Toggle
  toggleTrack: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: BRAND,
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },

  // Map
  map: {
    flex: 1,
  },

  // List view
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 12,
  },
  listCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  listCardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  listCardBar: {
    width: 5,
    flexShrink: 0,
  },
  listCardBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
  },
  listCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  listCardName: {
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  catBadgeText: {
    fontWeight: '600',
  },
  listMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    marginLeft: 4,
  },
  discountText: {
    color: '#047857',
    fontWeight: '600',
  },
  listCardDesc: {
    color: '#4B5563',
    lineHeight: 20,
  },

  // Web fallback
  webFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  webFallbackTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  webFallbackBody: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  webFallbackBtn: {
    backgroundColor: BRAND,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  webFallbackBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

// Bottom sheet styles (separate object for clarity)
const sheet = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  catBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  catBadgeText: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  discountText: {
    color: '#047857',
    fontWeight: '700',
  },
  name: {
    fontWeight: '800',
    color: '#111827',
    lineHeight: 32,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  description: {
    color: '#374151',
    lineHeight: 26,
  },
  closeBtn: {
    marginTop: 8,
    backgroundColor: BRAND,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  closeBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
