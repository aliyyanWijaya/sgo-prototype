export type RetailerCategory =
  | "Cafe"
  | "Retail"
  | "Bookstore"
  | "Pharmacy"
  | "Restaurant";

export interface Retailer {
  id: string;
  name: string;
  category: RetailerCategory;
  /** Human-readable distance string, e.g. "0.8 km away" */
  distance: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  discountAvailable?: boolean;
  phone?: string;
  address?: string;
}

/** Default map center — Hamilton city, New Zealand */
export const HAMILTON_CENTER = {
  latitude: -37.787,
  longitude: 175.2793,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
} as const;

/** One distinct colour per category — used for map pins and badges */
export const CATEGORY_COLORS: Record<RetailerCategory, string> = {
  Cafe: "#D97706",
  Retail: "#2563EB",
  Bookstore: "#7C3AED",
  Pharmacy: "#059669",
  Restaurant: "#DC2626",
};

export const RETAILERS: Retailer[] = [
  {
    id: "r1",
    name: "Waikato Cafe & Bakery",
    category: "Cafe",
    distance: "0.8 km away",
    description:
      "Freshly baked goods, great coffee, and a warm welcome every morning.",
    coordinate: { latitude: -37.7888, longitude: 175.2801 },
    discountAvailable: true,
    phone: "+64 7 555 0182",
    address: "12 Victoria Street, Hamilton Central",
  },
  {
    id: "r2",
    name: "Hamilton Outdoor Gear",
    category: "Retail",
    distance: "1.2 km away",
    description:
      "Quality walking shoes, rain jackets, and travel essentials for the road ahead.",
    coordinate: { latitude: -37.7855, longitude: 175.282 },
    discountAvailable: true,
    phone: "+64 7 555 0143",
    address: "45 Anglesea Street, Hamilton Central",
  },
  {
    id: "r3",
    name: "Riverside Books",
    category: "Bookstore",
    distance: "0.5 km away",
    description:
      "A cosy independent bookshop with a great selection of New Zealand authors.",
    coordinate: { latitude: -37.7862, longitude: 175.2778 },
    discountAvailable: false,
    phone: "+64 7 555 0197",
    address: "8 Hood Street, Hamilton Central",
  },
  {
    id: "r4",
    name: "Garden City Pharmacy",
    category: "Pharmacy",
    distance: "1.5 km away",
    description:
      "Friendly pharmacists, travel health advice, and all your everyday essentials.",
    coordinate: { latitude: -37.7912, longitude: 175.2765 },
    discountAvailable: true,
    phone: "+64 7 555 0156",
    address: "20 Ward Street, Hamilton Central",
  },
  {
    id: "r5",
    name: "Founder's Table Restaurant",
    category: "Restaurant",
    distance: "2.1 km away",
    description:
      "Classic New Zealand cuisine in a relaxed setting. Seniors menu available daily.",
    coordinate: { latitude: -37.784, longitude: 175.283 },
    discountAvailable: false,
    phone: "+64 7 555 0129",
    address: "3 Grantham Street, Hamilton Central",
  },
];
