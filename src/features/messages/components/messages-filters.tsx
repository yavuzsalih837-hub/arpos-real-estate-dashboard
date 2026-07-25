"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockAgents } from "@/features/agents/data";

export type MessageFilterValues = {
  search: string;
  agentId: string;
  unreadOnly: boolean;
};

type MessagesFiltersProps = {
  values: MessageFilterValues;
  onChange: (values: MessageFilterValues) => void;
};

export function MessagesFilters({ values, onChange }: MessagesFiltersProps) {
  return (
    <div className="flex flex-col gap-2 border-b p-2">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={values.search}
          onChange={(event) => onChange({ ...values, search: event.target.value })}
          placeholder="Ara..."
          className="pl-8"
        />
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={values.agentId}
          onValueChange={(agentId) => onChange({ ...values, agentId: agentId as string })}
        >
          <SelectTrigger className="flex-1">
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
        <Button
          variant="outline"
          size="sm"
          aria-pressed={values.unreadOnly}
          onClick={() => onChange({ ...values, unreadOnly: !values.unreadOnly })}
          className={values.unreadOnly ? "bg-accent text-accent-foreground" : undefined}
        >
          Okunmamışlar
        </Button>
      </div>
    </div>
  );
}
