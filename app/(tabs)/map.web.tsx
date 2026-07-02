// app/(tabs)/map.web.tsx
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Point = { id: string; lat: number; lng: number; title: string };

export default function MapScreen() {
  const [Map, setMap] = useState<any>(null);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    // Only runs in the browser, never during SSR
    let mounted = true;

    (async () => {
      const L = (await import("leaflet")).default;
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

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mounted) {
        setMap({ MapContainer, TileLayer, Marker, Popup });
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setPoints([
      { id: "1", lat: -37.787, lng: 175.2793, title: "Hamilton CBD" },
    ]);
  }, []);

  if (!Map) {
    return (
      <View style={styles.container}>
        <Text>Loading map…</Text>
      </View>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = Map;

  return (
    <View style={styles.container}>
      <MapContainer
        center={[-37.787, 175.2793]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p: Point) => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>{p.title}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
