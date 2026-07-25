import { isSameDay } from "date-fns";
import { DEMO_TODAY } from "@/features/appointments/data";
import { getAgentById } from "@/features/agents/data";
import { getLeadById } from "@/features/leads/data";
import type { Agent } from "@/features/agents/types";
import type { Lead } from "@/features/leads/types";
import type { Conversation, Message } from "@/features/messages/types";

export type EnrichedConversation = Conversation & {
  lead: Lead | undefined;
  agent: Agent | undefined;
  lastMessage: Message | undefined;
  unreadCount: number;
};

export function getLastMessage(conversation: Conversation): Message | undefined {
  return conversation.messages[conversation.messages.length - 1];
}

export function getUnreadCount(conversation: Conversation): number {
  return conversation.messages.filter(
    (message) => message.direction === "inbound" && !message.read,
  ).length;
}

export function needsReply(conversation: Conversation): boolean {
  const lastMessage = getLastMessage(conversation);
  return lastMessage?.direction === "inbound";
}

export function enrichConversation(conversation: Conversation): EnrichedConversation {
  return {
    ...conversation,
    lead: getLeadById(conversation.leadId),
    agent: getAgentById(conversation.agentId),
    lastMessage: getLastMessage(conversation),
    unreadCount: getUnreadCount(conversation),
  };
}

export function sortConversationsByRecency(
  conversations: Conversation[],
): Conversation[] {
  return [...conversations].sort((a, b) => {
    const aTime = new Date(getLastMessage(a)?.sentAt ?? 0).getTime();
    const bTime = new Date(getLastMessage(b)?.sentAt ?? 0).getTime();
    return bTime - aTime;
  });
}

export type ConversationCounts = {
  total: number;
  unreadConversations: number;
  todayInbound: number;
  pendingReply: number;
};

export function getConversationCounts(
  conversations: Conversation[],
): ConversationCounts {
  const todayInbound = conversations.reduce(
    (sum, conversation) =>
      sum +
      conversation.messages.filter(
        (message) =>
          message.direction === "inbound" &&
          isSameDay(new Date(message.sentAt), DEMO_TODAY),
      ).length,
    0,
  );

  return {
    total: conversations.length,
    unreadConversations: conversations.filter((c) => getUnreadCount(c) > 0).length,
    todayInbound,
    pendingReply: conversations.filter(needsReply).length,
  };
}
