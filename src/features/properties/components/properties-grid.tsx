import { PropertyCard } from "@/features/properties/components/property-card";
import type { Property } from "@/features/properties/types";

type PropertiesGridProps = {
  properties: Property[];
  onSelect: (property: Property) => void;
};

export function PropertiesGrid({ properties, onSelect }: PropertiesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} onSelect={onSelect} />
      ))}
    </div>
  );
}
