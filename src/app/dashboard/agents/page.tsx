import { PageHeader } from "@/components/shared/page-header";
import { AgentsView } from "@/features/agents/components/agents-view";
import { getAgents } from "@/features/agents/queries";

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <>
      <PageHeader
        title="Danışman Yönetimi"
        description={`${agents.length} danışman listeleniyor.`}
      />
      <AgentsView agents={agents} />
    </>
  );
}
