"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { mockAgents } from "@/features/agents/data";
import {
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPE_LABELS,
  type Property,
  type PropertyStatus,
  type PropertyType,
} from "@/features/properties/types";
import {
  PRICE_BANDS,
  getDistrictsForCity,
  getUniqueCities,
} from "@/features/properties/lib";

export type PropertyFilterValues = {
  search: string;
  city: string;
  district: string;
  propertyType: PropertyType | "all";
  status: PropertyStatus | "all";
  agentId: string;
  priceBand: string;
};

type PropertiesFiltersProps = {
  properties: Property[];
  values: PropertyFilterValues;
  onChange: (values: PropertyFilterValues) => void;
  onReset: () => void;
};

export function PropertiesFilters({
  properties,
  values,
  onChange,
  onReset,
}: PropertiesFiltersProps) {
  const cities = getUniqueCities(properties);
  const districts = getDistrictsForCity(properties, values.city);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-56">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={values.search}
          onChange={(event) =>
            onChange({ ...values, search: event.target.value })
          }
          placeholder="İlan başlığı veya ilan kodu ara..."
          className="pl-8"
        />
      </div>

      <Select
        value={values.city}
        onValueChange={(city) =>
          onChange({ ...values, city: city as string, district: "all" })
        }
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Şehir" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Şehirler</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.district}
        onValueChange={(district) =>
          onChange({ ...values, district: district as string })
        }
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="İlçe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm İlçeler</SelectItem>
          {districts.map((district) => (
            <SelectItem key={district} value={district}>
              {district}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.propertyType}
        onValueChange={(propertyType) =>
          onChange({
            ...values,
            propertyType: propertyType as PropertyType | "all",
          })
        }
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Emlak Tipi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Tipler</SelectItem>
          {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.status}
        onValueChange={(status) =>
          onChange({ ...values, status: status as PropertyStatus | "all" })
        }
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Durum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Durumlar</SelectItem>
          {Object.entries(PROPERTY_STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.agentId}
        onValueChange={(agentId) =>
          onChange({ ...values, agentId: agentId as string })
        }
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Danışman" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Danışmanlar</SelectItem>
          {mockAgents.map((agent) => (
            <SelectItem key={agent.id} value={agent.id}>
              {agent.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.priceBand}
        onValueChange={(priceBand) =>
          onChange({ ...values, priceBand: priceBand as string })
        }
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Fiyat Aralığı" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Fiyatlar</SelectItem>
          {PRICE_BANDS.map((band) => (
            <SelectItem key={band.id} value={band.id}>
              {band.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" onClick={onReset} className="shrink-0">
        Filtreleri Temizle
      </Button>
    </div>
  );
}
