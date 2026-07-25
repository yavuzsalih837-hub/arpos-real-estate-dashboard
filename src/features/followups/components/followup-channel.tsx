import {
  ClipboardList,
  Mail,
  MessageCircle,
  Phone,
  Users2,
  type LucideIcon,
} from "lucide-react";
import {
  FOLLOWUP_CHANNEL_LABELS,
  type FollowUpChannel,
} from "@/features/followups/types";

export const FOLLOWUP_CHANNEL_ICONS: Record<FollowUpChannel, LucideIcon> = {
  whatsapp: MessageCircle,
  telefon: Phone,
  "e-posta": Mail,
  gorusme: Users2,
  "manuel-gorev": ClipboardList,
};

export function FollowUpChannelTag({ channel }: { channel: FollowUpChannel }) {
  const Icon = FOLLOWUP_CHANNEL_ICONS[channel];

  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="size-3.5 shrink-0" />
      {FOLLOWUP_CHANNEL_LABELS[channel]}
    </span>
  );
}
