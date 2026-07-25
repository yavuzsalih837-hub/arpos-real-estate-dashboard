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
  APPOINTMENT_STATUS_LABELS,
  type AppointmentStatus,
} from "@/features/appointments/types";
import { DATE_RANGE_LABELS, type DateRangeFilter } from "@/features/appointments/lib";

export type AppointmentFilterValues = {
  search: string;
  agentId: string;
  status: AppointmentStatus | "all";
  dateRange: DateRangeFilter;
};

type AppointmentsFiltersProps = {
  values: AppointmentFilterValues;
  onChange: (values: AppointmentFilterValues) => void;
  onReset: () => void;
};

export function AppointmentsFilters({
  values,
  onChange,
  onReset,
}: AppointmentsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-56">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={values.search}
          onChange={(event) =>
            onChange({ ...values, search: event.target.value })
          }
          placeholder="Müşteri veya portföy adına göre ara..."
          className="pl-8"
        />
      </div>

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
        value={values.status}
        onValueChange={(status) =>
          onChange({ ...values, status: status as AppointmentStatus | "all" })
        }
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Durum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Durumlar</SelectItem>
          {Object.entries(APPOINTMENT_STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.dateRange}
        onValueChange={(dateRange) =>
          onChange({ ...values, dateRange: dateRange as DateRangeFilter })
        }
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Tarih" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(DATE_RANGE_LABELS).map(([value, label]) => (
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
