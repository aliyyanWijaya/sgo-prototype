import {
  CATEGORY_COLORS,
  HAMILTON_CENTER,
  RETAILERS,
  RetailerCategory,
} from '@/data/retailers';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VALID_CATEGORIES: RetailerCategory[] = [
  'Cafe',
  'Retail',
  'Bookstore',
  'Pharmacy',
  'Restaurant',
];

// Rough bounding box for the greater Waikato / Hamilton region.
const HAMILTON_BOUNDS = {
  latMin: -38.5,
  latMax: -37.0,
  lngMin: 174.5,
  lngMax: 176.0,
};

// ─── Data-structure tests ──────────────────────────────────────────────────────

describe('retailers data file', () => {
  it('has at least 4 retailers', () => {
    expect(RETAILERS.length).toBeGreaterThanOrEqual(4);
  });

  it('every retailer has all required fields (name, category, distance, description)', () => {
    RETAILERS.forEach((r) => {
      expect(typeof r.id).toBe('string');
      expect(r.id).toBeTruthy();

      expect(typeof r.name).toBe('string');
      expect(r.name).toBeTruthy();

      expect(typeof r.category).toBe('string');
      expect(VALID_CATEGORIES).toContain(r.category);

      expect(typeof r.distance).toBe('string');
      // distance must look like "0.8 km away" or similar
      expect(r.distance).toMatch(/\d+(\.\d+)?\s*km/i);

      expect(typeof r.description).toBe('string');
      expect(r.description).toBeTruthy();
    });
  });

  it('every retailer has valid numeric GPS coordinates in the Hamilton area', () => {
    RETAILERS.forEach((r) => {
      const { latitude, longitude } = r.coordinate;

      expect(typeof latitude).toBe('number');
      expect(typeof longitude).toBe('number');
      expect(Number.isFinite(latitude)).toBe(true);
      expect(Number.isFinite(longitude)).toBe(true);

      expect(latitude).toBeGreaterThan(HAMILTON_BOUNDS.latMin);
      expect(latitude).toBeLessThan(HAMILTON_BOUNDS.latMax);
      expect(longitude).toBeGreaterThan(HAMILTON_BOUNDS.lngMin);
      expect(longitude).toBeLessThan(HAMILTON_BOUNDS.lngMax);
    });
  });

  it('retailer IDs are all unique', () => {
    const ids = RETAILERS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('discountAvailable is a boolean when present', () => {
    RETAILERS.forEach((r) => {
      if ('discountAvailable' in r) {
        expect(typeof r.discountAvailable).toBe('boolean');
      }
    });
  });

  it('CATEGORY_COLORS has a valid hex entry for every category in the data', () => {
    RETAILERS.forEach((r) => {
      const color = CATEGORY_COLORS[r.category];
      expect(color).toBeTruthy();
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('all five expected categories have colour definitions', () => {
    VALID_CATEGORIES.forEach((cat) => {
      expect(CATEGORY_COLORS[cat]).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('HAMILTON_CENTER has valid coordinates and positive deltas', () => {
    expect(HAMILTON_CENTER.latitude).toBeCloseTo(-37.787, 2);
    expect(HAMILTON_CENTER.longitude).toBeCloseTo(175.2793, 2);
    expect(HAMILTON_CENTER.latitudeDelta).toBeGreaterThan(0);
    expect(HAMILTON_CENTER.longitudeDelta).toBeGreaterThan(0);
  });
});
