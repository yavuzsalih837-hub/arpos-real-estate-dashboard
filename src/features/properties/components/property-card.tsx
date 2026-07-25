import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyTRY } from "@/lib/utils";
import { PropertyStatusBadge } from "@/features/properties/components/property-status-badge";
import { PropertyImagePlaceholder } from "@/features/properties/components/property-image-placeholder";
import { formatArea } from "@/features/properties/lib";
import { getAgentById } from "@/features/agents/data";
import { PROPERTY_TYPE_LABELS, type Property } from "@/features/properties/types";

type PropertyCardProps = {
  property: Property;
  onSelect: (property: Property) => void;
};

export function PropertyCard({ property, onSelect }: PropertyCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(property)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(property);
        }
      }}
      className="cursor-pointer gap-3 overflow-hidden py-0"
    >
      <PropertyImagePlaceholder className="aspect-[4/3] rounded-none" />
      <CardContent className="flex flex-col gap-2.5 px-4 pb-4">
        <div className="flex items-start justify-between gap-2">
          <span className="line-clamp-2 text-sm font-medium">
            {property.title}
          </span>
          <PropertyStatusBadge status={property.status} />
        </div>

        <span className="text-lg font-semibold tabular-nums text-primary">
          {formatCurrencyTRY(property.price)}
        </span>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span>
            {property.district}, {property.city}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{PROPERTY_TYPE_LABELS[property.propertyType]}</span>
          {property.rooms !== "-" ? <span>{property.rooms}</span> : null}
          <span>{formatArea(property.areaM2)}</span>
        </div>

        <div className="flex items-center justify-between border-t pt-2.5 text-xs text-muted-foreground">
          <span>{getAgentById(property.agentId)?.name ?? "Atanmadı"}</span>
          <span>
            {formatDistanceToNow(new Date(property.updatedAt), {
              addSuffix: true,
              locale: tr,
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
