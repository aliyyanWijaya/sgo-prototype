// app/(tabs)/map.web.tsx
import AppText from "@/components/AppText";
import {
  CATEGORY_COLORS,
  HAMILTON_CENTER,
  RETAILERS,
  Retailer,
} from "@/data/retailers";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";

export default function MapScreen() {
  const [Map, setMap] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const [selected, setSelected] = useState<Retailer | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const leaflet = (await import("leaflet")).default;
      const { MapContainer, TileLayer, Marker, Popup } =
        await import("react-leaflet");

      const id = "leaflet-css-cdn";
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mounted) {
        setL(leaflet);
        setMap({ MapContainer, TileLayer, Marker, Popup });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!Map || !L) {
    return (
      <View style={styles.container}>
        <AppText>Loading map…</AppText>
      </View>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = Map;

  const makeIcon = (category: Retailer["category"], isSelected: boolean) =>
    L.divIcon({
      className: "",
      html: `<div style="
        width: ${isSelected ? 32 : 26}px;
        height: ${isSelected ? 32 : 26}px;
        border-radius: 50%;
        background: ${CATEGORY_COLORS[category]};
        border: 3px solid #FFFFFF;
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      "></div>`,
      iconSize: [isSelected ? 32 : 26, isSelected ? 32 : 26],
      iconAnchor: [isSelected ? 16 : 13, isSelected ? 16 : 13],
    });

  const handleGetDirections = (retailer: Retailer) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${retailer.coordinate.latitude},${retailer.coordinate.longitude}`;
    Linking.openURL(url);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
  };

  return (
    <View style={styles.container}>
      <MapContainer
        center={[HAMILTON_CENTER.latitude, HAMILTON_CENTER.longitude]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {RETAILERS.map((retailer) => (
          <Marker
            key={retailer.id}
            position={[
              retailer.coordinate.latitude,
              retailer.coordinate.longitude,
            ]}
            icon={makeIcon(retailer.category, selected?.id === retailer.id)}
            eventHandlers={{
              click: (e: any) => {
                setSelected(retailer);
                e.target.openPopup();
              },
            }}
          >
            <Popup closeButton={false} autoPan={false}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>
                {retailer.name}
              </div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>
                {retailer.distance}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Detail panel — slides up from bottom when a marker is tapped */}
      {selected && (
        <View style={styles.panel}>
          <Pressable
            style={styles.closeBtn}
            onPress={() => setSelected(null)}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Feather name="x" size={20} color="#6B7280" />
          </Pressable>

          <View style={styles.panelHeader}>
            <View
              style={[
                styles.categoryDot,
                { backgroundColor: CATEGORY_COLORS[selected.category] },
              ]}
            />
            <AppText style={styles.panelCategory}>{selected.category}</AppText>
          </View>

          <AppText style={styles.panelTitle}>{selected.name}</AppText>
          <AppText style={styles.panelDistance}>{selected.distance}</AppText>

          {selected.address && (
            <View style={styles.infoLine}>
              <Feather name="map-pin" size={15} color="#6B7280" />
              <AppText style={styles.infoLineText}>{selected.address}</AppText>
            </View>
          )}

          <AppText style={styles.panelDescription}>
            {selected.description}
          </AppText>

          {selected.discountAvailable && (
            <View style={styles.discountBadge}>
              <Feather name="tag" size={13} color="#065F46" />
              <AppText style={styles.discountBadgeText}>
                Discount available
              </AppText>
            </View>
          )}

          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionBtn, styles.directionsBtn]}
              onPress={() => handleGetDirections(selected)}
              accessibilityRole="button"
              accessibilityLabel={`Get directions to ${selected.name}`}
            >
              <Feather name="navigation" size={17} color="#FFFFFF" />
              <AppText style={styles.actionBtnTextPrimary}>
                Get Directions
              </AppText>
            </Pressable>

            {selected.phone && (
              <Pressable
                style={[styles.actionBtn, styles.callBtn]}
                onPress={() => handleCall(selected.phone!)}
                accessibilityRole="button"
                accessibilityLabel={`Call ${selected.name}`}
              >
                <Feather name="phone" size={17} color="#2B7A77" />
                <AppText style={styles.actionBtnTextSecondary}>Call</AppText>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const BRAND = "#2B7A77";

const styles = StyleSheet.create({
  container: { flex: 1 },

  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // ← tambahin ini
    elevation: 1000,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  },

  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  panelCategory: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  panelTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 2,
    paddingRight: 40,
  },
  panelDistance: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },

  infoLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  infoLineText: {
    fontSize: 14,
    color: "#374151",
  },

  panelDescription: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 14,
  },

  discountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  discountBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#065F46",
  },

  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    flex: 1,
  },
  directionsBtn: {
    backgroundColor: BRAND,
  },
  callBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: BRAND,
  },
  actionBtnTextPrimary: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  actionBtnTextSecondary: {
    color: BRAND,
    fontSize: 16,
    fontWeight: "700",
  },
});
