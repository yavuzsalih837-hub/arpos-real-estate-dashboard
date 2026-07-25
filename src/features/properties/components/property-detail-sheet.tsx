import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { MapPin, Home, Ruler, User, Tag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyTRY } from "@/lib/utils";
import { PropertyStatusBadge } from "@/features/properties/components/property-status-badge";
import { PropertyImagePlaceholder } from "@/features/properties/components/property-image-placeholder";
import { formatArea } from "@/features/properties/lib";
import { getAgentById } from "@/features/agents/data";
import { PROPERTY_TYPE_LABELS, type Property } from "@/features/properties/types";

type PropertyDetailSheetProps = {
  property: Property | null;
  onOpenChange: (open: boolean) => void;
};

export function PropertyDetailSheet({
  property,
  onOpenChange,
}: PropertyDetailSheetProps) {
  return (
    <Sheet open={property !== null} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        {property ? (
          <>
            <SheetHeader className="border-b">
              <SheetTitle>{property.title}</SheetTitle>
              <div className="flex items-center gap-2 pt-1">
                <PropertyStatusBadge status={property.status} />
                <span className="text-xs text-muted-foreground">
                  {property.listingCode}
                </span>
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
              <PropertyImagePlaceholder className="aspect-video" iconClassName="size-8" />

              <span className="text-2xl font-semibold tabular-nums text-primary">
                {formatCurrencyTRY(property.price)}
              </span>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>
                    {property.neighborhood}, {property.district} / {property.city}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="size-4 text-muted-foreground" />
                  <span>
                    {PROPERTY_TYPE_LABELS[property.propertyType]}
                    {property.rooms !== "-" ? ` · ${property.rooms}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="size-4 text-muted-foreground" />
                  <span>{formatArea(property.areaM2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <span>{getAgentById(property.agentId)?.name ?? "Atanmadı"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="size-4 text-muted-foreground" />
                  <span>{property.listingCode}</span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Son Güncelleme</span>
                <span>
                  {format(new Date(property.updatedAt), "d MMMM yyyy", {
                    locale: tr,
                  })}
                </span>
              </div>

              <Separator />

              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-muted-foreground">Açıklama</span>
                <p className="text-sm">{property.description}</p>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
