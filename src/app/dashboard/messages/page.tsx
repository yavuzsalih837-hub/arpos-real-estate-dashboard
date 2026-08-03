import { PageHeader } from "@/components/shared/page-header";
import { MessagesView } from "@/features/messages/components/messages-view";
import { getConversations } from "@/features/messages/queries";
import { getLeads } from "@/features/leads/queries";

export default async function MessagesPage() {
  const [conversations, leads] = await Promise.all([
    getConversations(),
    getLeads(),
  ]);

  return (
    <>
      <PageHeader
        title="WhatsApp Mesajları"
        description="WhatsApp Cloud API üzerinden gelen ve giden mesajların merkezi."
      />
      <MessagesView conversations={conversations} leads={leads} />
    </>
  );
}
