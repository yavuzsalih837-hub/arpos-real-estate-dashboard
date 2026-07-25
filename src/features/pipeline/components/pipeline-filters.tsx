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
import { mockAgents } from "@/features/agents/data";

export type PipelineFilterValues = {
  search: string;
  agentId: string;
};

type PipelineFiltersProps = {
  values: PipelineFilterValues;
  onChange: (values: PipelineFilterValues) => void;
};

export function PipelineFilters({ values, onChange }: PipelineFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={values.search}
          onChange={(event) =>
            onChange({ ...values, search: event.target.value })
          }
          placeholder="İsim veya telefon ara..."
          className="pl-8"
        />
      </div>

      <Select
        value={values.agentId}
        onValueChange={(agentId) =>
          onChange({ ...values, agentId: agentId as string })
        }
      >
        <SelectTrigger className="w-full sm:w-48">
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
    </div>
  );
}
