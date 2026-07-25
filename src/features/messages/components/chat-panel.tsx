"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ContactQuickActions } from "@/components/shared/contact-quick-actions";
import { LeadStatusBadge } from "@/features/leads/components/lead-status-badge";
import { MessageBubble } from "@/features/messages/components/message-bubble";
import { MessageComposer } from "@/features/messages/components/message-composer";
import type { EnrichedConversation } from "@/features/messages/lib";

type ChatPanelProps = {
  conversation: EnrichedConversation;
  onSend: (content: string) => void;
  onBack: () => void;
};

export function ChatPanel({ conversation, onSend, onBack }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { lead, agent } = conversation;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [conversation.id, conversation.messages.length]);

  const initials = lead?.name
    ? lead.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b p-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Konuşma listesine dön"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">
            {lead?.name ?? "Bilinmeyen"}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {agent?.name ?? "Atanmadı"}
          </span>
        </div>
        {lead ? <LeadStatusBadge status={lead.status} /> : null}
        <ContactQuickActions
          phone={lead?.phone}
          email={lead?.email}
          showWhatsApp={false}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <MessageComposer onSend={onSend} />
    </div>
  );
}
