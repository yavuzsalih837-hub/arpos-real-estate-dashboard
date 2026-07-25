import { PageHeader } from "@/components/shared/page-header";
import { AgentsView } from "@/features/agents/components/agents-view";
import { mockAgents } from "@/features/agents/data";
import { simulateNetworkDelay } from "@/lib/utils";

export default async function AgentsPage() {
  await simulateNetworkDelay();

  return (
    <>
      <PageHeader
        title="Danışman Yönetimi"
        description={`${mockAgents.length} danışman listeleniyor.`}
      />
      <AgentsView agents={mockAgents} />
    </>
  );
}
