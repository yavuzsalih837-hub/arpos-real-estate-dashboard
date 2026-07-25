import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyTRY } from "@/lib/utils";
import { PropertyStatusBadge } from "@/features/properties/components/property-status-badge";
import { PropertyImagePlaceholder } from "@/features/properties/components/property-image-placeholder";
import { formatArea } from "@/features/properties/lib";
import { getAgentById } from "@/features/agents/data";
import { PROPERTY_TYPE_LABELS, type Property } from "@/features/properties/types";

type PropertiesTableProps = {
  properties: Property[];
  onSelect: (property: Property) => void;
};

export function PropertiesTable({ properties, onSelect }: PropertiesTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16" />
            <TableHead>İlan</TableHead>
            <TableHead>Fiyat</TableHead>
            <TableHead>Konum</TableHead>
            <TableHead>Tip / m²</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Danışman</TableHead>
            <TableHead>Güncellenme</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow
              key={property.id}
              onClick={() => onSelect(property)}
              className="cursor-pointer"
            >
              <TableCell>
                <PropertyImagePlaceholder className="aspect-square w-12" iconClassName="size-4" />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="max-w-56 truncate font-medium">
                    {property.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {property.listingCode}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium tabular-nums text-primary">
                {formatCurrencyTRY(property.price)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {property.district}, {property.city}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {PROPERTY_TYPE_LABELS[property.propertyType]}
                {property.rooms !== "-" ? ` · ${property.rooms}` : ""} ·{" "}
                {formatArea(property.areaM2)}
              </TableCell>
              <TableCell>
                <PropertyStatusBadge status={property.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getAgentById(property.agentId)?.name ?? "Atanmadı"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(property.updatedAt), {
                  addSuffix: true,
                  locale: tr,
                })}
              </TableCell>
              <TableCell>
                <ChevronRight className="size-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
