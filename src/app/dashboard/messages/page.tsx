import { PageHeader } from "@/components/shared/page-header";
import { MessagesView } from "@/features/messages/components/messages-view";
import { mockConversations } from "@/features/messages/data";
import { simulateNetworkDelay } from "@/lib/utils";

export default async function MessagesPage() {
  await simulateNetworkDelay();

  return (
    <>
      <PageHeader
        title="WhatsApp Mesajları"
        description="WhatsApp Cloud API üzerinden gelen ve giden mesajların merkezi."
      />
      <MessagesView conversations={mockConversations} />
    </>
  );
}
