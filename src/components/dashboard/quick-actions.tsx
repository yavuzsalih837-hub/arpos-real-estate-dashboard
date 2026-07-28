"use client";

import { CalendarPlus, MessageCircle } from "lucide-react";
import { ComingSoonButton } from "@/components/shared/coming-soon-button";
import { NewLeadDialog } from "@/features/leads/components/new-lead-dialog";
import { NewPropertyDialog } from "@/features/properties/components/new-property-dialog";
import type { Agent } from "@/features/agents/types";

const OTHER_ACTIONS = [
  { label: "Randevu Oluştur", icon: CalendarPlus },
  { label: "WhatsApp Mesajı Gönder", icon: MessageCircle },
] as const;

export function QuickActions({ agents }: { agents: Agent[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      <NewLeadDialog agents={agents} variant="outline" size="sm" />
      <NewPropertyDialog agents={agents} variant="outline" size="sm" />
      {OTHER_ACTIONS.map((action) => (
        <ComingSoonButton
          key={action.label}
          variant="outline"
          size="sm"
          icon={action.icon}
          label={action.label}
        />
      ))}
    </div>
  );
}
