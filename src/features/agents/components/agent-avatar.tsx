import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { AgentStatus } from "@/features/agents/types";

const STATUS_DOT_STYLES: Record<AgentStatus, string> = {
  aktif: "bg-emerald-500",
  izinli: "bg-amber-500",
  pasif: "bg-muted-foreground",
};

type AgentAvatarProps = {
  initials: string;
  status: AgentStatus;
  size?: "sm" | "default" | "lg";
};

export function AgentAvatar({ initials, status, size = "default" }: AgentAvatarProps) {
  return (
    <Avatar size={size}>
      <AvatarFallback>{initials}</AvatarFallback>
      <AvatarBadge className={cn(STATUS_DOT_STYLES[status], "bg-blend-normal")} />
    </Avatar>
  );
}
