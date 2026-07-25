"use client";

import { UserPlus, CalendarPlus, Building2, MessageCircle } from "lucide-react";
import { ComingSoonButton } from "@/components/shared/coming-soon-button";

const ACTIONS = [
  { label: "Yeni Lead Ekle", icon: UserPlus },
  { label: "Randevu Oluştur", icon: CalendarPlus },
  { label: "Portföy Ekle", icon: Building2 },
  { label: "WhatsApp Mesajı Gönder", icon: MessageCircle },
] as const;

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {ACTIONS.map((action) => (
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
