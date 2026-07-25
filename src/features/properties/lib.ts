import { mockProperties } from "@/features/properties/data";
import type { Property } from "@/features/properties/types";

export type PriceBand = {
  id: string;
  label: string;
  min: number;
  max: number | null;
};

export const PRICE_BANDS: PriceBand[] = [
  { id: "0-3m", label: "₺0 - ₺3M", min: 0, max: 3_000_000 },
  { id: "3-6m", label: "₺3M - ₺6M", min: 3_000_000, max: 6_000_000 },
  { id: "6-10m", label: "₺6M - ₺10M", min: 6_000_000, max: 10_000_000 },
  { id: "10-15m", label: "₺10M - ₺15M", min: 10_000_000, max: 15_000_000 },
  { id: "15m+", label: "₺15M ve üzeri", min: 15_000_000, max: null },
];

export function matchesPriceBand(price: number, bandId: string): boolean {
  if (bandId === "all") return true;

  const band = PRICE_BANDS.find((item) => item.id === bandId);
  if (!band) return true;

  return price >= band.min && (band.max === null || price < band.max);
}

export function getUniqueCities(): string[] {
  return Array.from(new Set(mockProperties.map((property) => property.city))).sort(
    (a, b) => a.localeCompare(b, "tr"),
  );
}

export function getDistrictsForCity(city: string): string[] {
  const source =
    city === "all"
      ? mockProperties
      : mockProperties.filter((property) => property.city === city);

  return Array.from(new Set(source.map((property) => property.district))).sort(
    (a, b) => a.localeCompare(b, "tr"),
  );
}

export function formatArea(areaM2: number): string {
  return `${areaM2} m²`;
}

export function getActiveProperties(): Property[] {
  return mockProperties.filter((property) => property.status === "aktif");
}
