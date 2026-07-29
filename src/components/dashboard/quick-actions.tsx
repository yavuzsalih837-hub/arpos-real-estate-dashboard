"use client";

import { MessageCircle } from "lucide-react";
import { ComingSoonButton } from "@/components/shared/coming-soon-button";
import { NewLeadDialog } from "@/features/leads/components/new-lead-dialog";
import { NewPropertyDialog } from "@/features/properties/components/new-property-dialog";
import { NewAppointmentDialog } from "@/features/appointments/components/new-appointment-dialog";
import type { Agent } from "@/features/agents/types";
import type { Lead } from "@/features/leads/types";
import type { Property } from "@/features/properties/types";

const OTHER_ACTIONS = [
  { label: "WhatsApp Mesajı Gönder", icon: MessageCircle },
] as const;

type QuickActionsProps = {
  agents: Agent[];
  leads: Lead[];
  properties: Property[];
};

export function QuickActions({ agents, leads, properties }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <NewLeadDialog agents={agents} variant="outline" size="sm" />
      <NewPropertyDialog agents={agents} variant="outline" size="sm" />
      <NewAppointmentDialog
        leads={leads}
        agents={agents}
        properties={properties}
        variant="outline"
        size="sm"
      />
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
