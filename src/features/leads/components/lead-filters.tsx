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
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  type LeadSource,
  type LeadStatus,
} from "@/features/leads/types";
import { mockAgents } from "@/features/agents/data";

export type LeadFilterValues = {
  search: string;
  status: LeadStatus | "all";
  source: LeadSource | "all";
  agentId: string | "all";
};

type LeadFiltersProps = {
  values: LeadFilterValues;
  onChange: (values: LeadFilterValues) => void;
  onReset: () => void;
};

export function LeadFilters({ values, onChange, onReset }: LeadFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-56">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={values.search}
          onChange={(event) =>
            onChange({ ...values, search: event.target.value })
          }
          placeholder="İsim, telefon veya e-posta ara..."
          className="pl-8"
        />
      </div>

      <Select
        value={values.status}
        onValueChange={(status) =>
          onChange({ ...values, status: status as LeadStatus | "all" })
        }
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Durum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Durumlar</SelectItem>
          {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.source}
        onValueChange={(source) =>
          onChange({ ...values, source: source as LeadSource | "all" })
        }
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Kaynak" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Kaynaklar</SelectItem>
          {Object.entries(LEAD_SOURCE_LABELS).map(([value, label]) => (
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
        <SelectTrigger className="w-full sm:w-44">
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

      <Button variant="ghost" size="sm" onClick={onReset} className="shrink-0">
        Filtreleri Temizle
      </Button>
    </div>
  );
}
