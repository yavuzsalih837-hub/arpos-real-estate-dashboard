import { PageHeader } from "@/components/shared/page-header";
import { MessagesView } from "@/features/messages/components/messages-view";
import { getConversations } from "@/features/messages/queries";

export default async function MessagesPage() {
  const conversations = await getConversations();

  return (
    <>
      <PageHeader
        title="WhatsApp Mesajları"
        description="WhatsApp Cloud API üzerinden gelen ve giden mesajların merkezi."
      />
      <MessagesView conversations={conversations} />
    </>
  );
}
