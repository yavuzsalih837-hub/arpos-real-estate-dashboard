import { MessageSquareOff } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ConversationListItem } from "@/features/messages/components/conversation-list-item";
import type { EnrichedConversation } from "@/features/messages/lib";

type ConversationsListProps = {
  conversations: EnrichedConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

export function ConversationsList({
  conversations,
  activeId,
  onSelect,
}: ConversationsListProps) {
  if (conversations.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          icon={MessageSquareOff}
          title="Sonuç bulunamadı"
          description="Filtrelere uygun konuşma bulunmuyor."
          compact
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {conversations.map((conversation) => (
        <ConversationListItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
