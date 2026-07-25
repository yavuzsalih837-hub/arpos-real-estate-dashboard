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
import {
  AGENT_SORT_LABELS,
  getUniqueRegions,
  getUniqueSpecialties,
  type AgentSortOption,
} from "@/features/agents/lib";
import { AGENT_STATUS_LABELS, type AgentStatus } from "@/features/agents/types";

export type AgentFilterValues = {
  search: string;
  status: AgentStatus | "all";
  region: string;
  specialty: string;
  sortBy: AgentSortOption;
};

type AgentsFiltersProps = {
  values: AgentFilterValues;
  onChange: (values: AgentFilterValues) => void;
  onReset: () => void;
};

export function AgentsFilters({ values, onChange, onReset }: AgentsFiltersProps) {
  const regions = getUniqueRegions();
  const specialties = getUniqueSpecialties();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-56">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={values.search}
          onChange={(event) =>
            onChange({ ...values, search: event.target.value })
          }
          placeholder="Danışman adı, e-posta veya telefon ara..."
          className="pl-8"
        />
      </div>

      <Select
        value={values.status}
        onValueChange={(status) =>
          onChange({ ...values, status: status as AgentStatus | "all" })
        }
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Durum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Durumlar</SelectItem>
          {Object.entries(AGENT_STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.region}
        onValueChange={(region) => onChange({ ...values, region: region as string })}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Bölge" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Bölgeler</SelectItem>
          {regions.map((region) => (
            <SelectItem key={region} value={region}>
              {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.specialty}
        onValueChange={(specialty) =>
          onChange({ ...values, specialty: specialty as string })
        }
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Uzmanlık" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Uzmanlıklar</SelectItem>
          {specialties.map((specialty) => (
            <SelectItem key={specialty} value={specialty}>
              {specialty}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.sortBy}
        onValueChange={(sortBy) =>
          onChange({ ...values, sortBy: sortBy as AgentSortOption })
        }
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Sıralama" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(AGENT_SORT_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
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
