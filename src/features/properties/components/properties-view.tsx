"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, Plus, SearchX, Table2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ComingSoonButton } from "@/components/shared/coming-soon-button";
import { ViewToggle, type ViewToggleOption } from "@/components/shared/view-toggle";
import {
  PropertiesFilters,
  type PropertyFilterValues,
} from "@/features/properties/components/properties-filters";
import { PropertiesGrid } from "@/features/properties/components/properties-grid";
import { PropertiesTable } from "@/features/properties/components/properties-table";
import { PropertyDetailSheet } from "@/features/properties/components/property-detail-sheet";
import { matchesPriceBand } from "@/features/properties/lib";
import type { Property } from "@/features/properties/types";

const DEFAULT_FILTERS: PropertyFilterValues = {
  search: "",
  city: "all",
  district: "all",
  propertyType: "all",
  status: "all",
  agentId: "all",
  priceBand: "all",
};

type ViewMode = "card" | "table";

const VIEW_OPTIONS: ViewToggleOption<ViewMode>[] = [
  { value: "card", label: "Kart görünümü", icon: LayoutGrid },
  { value: "table", label: "Tablo görünümü", icon: Table2 },
];

export function PropertiesView({ properties }: { properties: Property[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [filters, setFilters] = useState<PropertyFilterValues>(DEFAULT_FILTERS);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filteredProperties = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return properties
      .filter((property) => {
        if (filters.city !== "all" && property.city !== filters.city) {
          return false;
        }
        if (filters.district !== "all" && property.district !== filters.district) {
          return false;
        }
        if (
          filters.propertyType !== "all" &&
          property.propertyType !== filters.propertyType
        ) {
          return false;
        }
        if (filters.status !== "all" && property.status !== filters.status) {
          return false;
        }
        if (filters.agentId !== "all" && property.agentId !== filters.agentId) {
          return false;
        }
        if (!matchesPriceBand(property.price, filters.priceBand)) {
          return false;
        }
        if (!search) return true;

        return (
          property.title.toLowerCase().includes(search) ||
          property.listingCode.toLowerCase().includes(search)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }, [properties, filters]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <PropertiesFilters
          properties={properties}
          values={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />
        <div className="flex shrink-0 items-center gap-2">
          <ViewToggle value={viewMode} onChange={setViewMode} options={VIEW_OPTIONS} />
          <ComingSoonButton icon={Plus} label="Yeni Portföy Ekle" size="sm" />
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Sonuç bulunamadı"
          description="Filtrelere uygun portföy bulunmuyor. Filtreleri temizleyip tekrar deneyebilirsiniz."
        />
      ) : viewMode === "card" ? (
        <PropertiesGrid
          properties={filteredProperties}
          onSelect={setSelectedProperty}
        />
      ) : (
        <PropertiesTable
          properties={filteredProperties}
          onSelect={setSelectedProperty}
        />
      )}

      <PropertyDetailSheet
        property={selectedProperty}
        onOpenChange={(open) => !open && setSelectedProperty(null)}
      />
    </div>
  );
}
