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
  FOLLOWUP_CHANNEL_LABELS,
  FOLLOWUP_STATUS_LABELS,
  type FollowUp,
  type FollowUpChannel,
  type FollowUpStatus,
} from "@/features/followups/types";
import {
  DATE_RANGE_LABELS,
  getUniqueFollowUpLeads,
  type DateRangeFilter,
} from "@/features/followups/lib";

export type FollowUpFilterValues = {
  search: string;
  leadId: string;
  agentId: string;
  status: FollowUpStatus | "all";
  channel: FollowUpChannel | "all";
  dateRange: DateRangeFilter;
};

type FollowUpsFiltersProps = {
  followUps: FollowUp[];
  values: FollowUpFilterValues;
  onChange: (values: FollowUpFilterValues) => void;
  onReset: () => void;
};

export function FollowUpsFilters({
  followUps,
  values,
  onChange,
  onReset,
}: FollowUpsFiltersProps) {
  const leads = getUniqueFollowUpLeads(followUps);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-56">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={values.search}
          onChange={(event) =>
            onChange({ ...values, search: event.target.value })
          }
          placeholder="Müşteri adı, telefon veya e-posta ara..."
          className="pl-8"
        />
      </div>

      <Select
        value={values.leadId}
        onValueChange={(leadId) => onChange({ ...values, leadId: leadId as string })}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Lead" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Lead&apos;ler</SelectItem>
          {leads.map((lead) => (
            <SelectItem key={lead.id} value={lead.id}>
              {lead.name}
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
        value={values.status}
        onValueChange={(status) =>
          onChange({ ...values, status: status as FollowUpStatus | "all" })
        }
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Durum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Durumlar</SelectItem>
          {Object.entries(FOLLOWUP_STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.channel}
        onValueChange={(channel) =>
          onChange({ ...values, channel: channel as FollowUpChannel | "all" })
        }
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Takip Türü" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Türler</SelectItem>
          {Object.entries(FOLLOWUP_CHANNEL_LABELS).map(([value, label]) => (
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
