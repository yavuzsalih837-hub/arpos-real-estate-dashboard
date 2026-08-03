"use client";

import { useMemo, useState } from "react";
import { MessageCircle, MessageCircleReply, MessagesSquare, Inbox } from "lucide-react";
import { cn, toNaiveISOString } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { DEMO_TODAY } from "@/features/appointments/data";
import {
  MessagesFilters,
  type MessageFilterValues,
} from "@/features/messages/components/messages-filters";
import { ConversationsList } from "@/features/messages/components/conversations-list";
import { ChatPanel } from "@/features/messages/components/chat-panel";
import {
  enrichConversation,
  getConversationCounts,
  getLastMessage,
  sortConversationsByRecency,
} from "@/features/messages/lib";
import type { Conversation } from "@/features/messages/types";
import type { Lead } from "@/features/leads/types";

const DEFAULT_FILTERS: MessageFilterValues = {
  search: "",
  agentId: "all",
  unreadOnly: false,
};

export function MessagesView({
  conversations: initialConversations,
  leads,
}: {
  conversations: Conversation[];
  leads: Lead[];
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const [filters, setFilters] = useState<MessageFilterValues>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = useMemo(() => getConversationCounts(conversations), [conversations]);

  const enrichedConversations = useMemo(
    () =>
      sortConversationsByRecency(conversations).map((conversation) =>
        enrichConversation(conversation, leads),
      ),
    [conversations, leads],
  );

  const filteredConversations = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return enrichedConversations.filter((conversation) => {
      if (filters.agentId !== "all" && conversation.agentId !== filters.agentId) {
        return false;
      }
      if (filters.unreadOnly && conversation.unreadCount === 0) {
        return false;
      }
      if (!search) return true;

      return (
        conversation.lead?.name.toLowerCase().includes(search) ||
        conversation.lead?.phone.replace(/\s/g, "").includes(search.replace(/\s/g, ""))
      );
    });
  }, [enrichedConversations, filters]);

  const selectedConversation =
    enrichedConversations.find((conversation) => conversation.id === selectedId) ??
    null;

  function handleSelect(id: string) {
    setSelectedId(id);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              messages: conversation.messages.map((message) =>
                message.direction === "inbound" ? { ...message, read: true } : message,
              ),
            }
          : conversation,
      ),
    );
  }

  function handleSend(content: string) {
    if (!selectedId) return;

    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.id !== selectedId) return conversation;

        const last = getLastMessage(conversation);
        const base = last ? new Date(last.sentAt) : DEMO_TODAY;
        const reference = base > DEMO_TODAY ? base : DEMO_TODAY;
        const sentAt = new Date(reference.getTime() + 60_000);

        return {
          ...conversation,
          messages: [
            ...conversation.messages,
            {
              id: `${conversation.id}-m${conversation.messages.length + 1}`,
              direction: "outbound",
              content,
              sentAt: toNaiveISOString(sentAt),
              read: true,
              deliveryStatus: "gonderildi",
            },
          ],
        };
      }),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Toplam Konuşma"
          value={String(counts.total)}
          icon={MessagesSquare}
          accent
        />
        <StatCard
          label="Okunmamış Konuşma"
          value={String(counts.unreadConversations)}
          icon={Inbox}
        />
        <StatCard
          label="Bugün Gelen Mesaj"
          value={String(counts.todayInbound)}
          icon={MessageCircle}
        />
        <StatCard
          label="Yanıt Bekleyen"
          value={String(counts.pendingReply)}
          icon={MessageCircleReply}
        />
      </div>

      <div className="flex h-[70vh] min-h-[28rem] overflow-hidden rounded-lg border bg-card">
        <div
          className={cn(
            "flex w-full flex-col md:w-80 md:shrink-0 md:border-r",
            selectedId && "hidden md:flex",
          )}
        >
          <MessagesFilters values={filters} onChange={setFilters} />
          <div className="flex-1 overflow-y-auto">
            <ConversationsList
              conversations={filteredConversations}
              activeId={selectedId}
              onSelect={handleSelect}
            />
          </div>
        </div>

        <div className={cn("flex-1", !selectedId && "hidden md:flex")}>
          {selectedConversation ? (
            <ChatPanel
              conversation={selectedConversation}
              onSend={handleSend}
              onBack={() => setSelectedId(null)}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center p-6">
              <EmptyState
                icon={MessageCircle}
                title="Bir konuşma seçin"
                description="Mesajları görüntülemek için soldaki listeden bir konuşma seçin."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
