import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LeadStatusBadge } from "@/features/leads/components/lead-status-badge";
import type { EnrichedConversation } from "@/features/messages/lib";

type ConversationListItemProps = {
  conversation: EnrichedConversation;
  isActive: boolean;
  onSelect: (id: string) => void;
};

export function ConversationListItem({
  conversation,
  isActive,
  onSelect,
}: ConversationListItemProps) {
  const { lead, lastMessage, unreadCount } = conversation;
  const initials = lead?.name
    ? lead.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={cn(
        "flex w-full items-start gap-3 border-b px-3 py-3 text-left transition-colors hover:bg-accent",
        isActive && "bg-accent",
      )}
    >
      <Avatar>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium">
            {lead?.name ?? "Bilinmeyen"}
          </span>
          {lastMessage ? (
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {formatDistanceToNow(new Date(lastMessage.sentAt), {
                addSuffix: true,
                locale: tr,
              })}
            </span>
          ) : null}
        </div>
        <p
          className={cn(
            "truncate text-xs",
            unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground",
          )}
        >
          {lastMessage?.direction === "outbound" ? "Siz: " : ""}
          {lastMessage?.content ?? "Henüz mesaj yok"}
        </p>
        <div className="flex items-center justify-between gap-2 pt-0.5">
          {lead ? <LeadStatusBadge status={lead.status} /> : <span />}
          {unreadCount > 0 ? (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
              {unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
