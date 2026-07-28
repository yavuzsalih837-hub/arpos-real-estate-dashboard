import { PageHeader } from "@/components/shared/page-header";
import { LeadsView } from "@/features/leads/components/leads-view";
import { NewLeadDialog } from "@/features/leads/components/new-lead-dialog";
import { getLeads } from "@/features/leads/queries";
import { getAgents } from "@/features/agents/queries";

export default async function LeadsPage() {
  const [leads, agents] = await Promise.all([getLeads(), getAgents()]);

  return (
    <>
      <PageHeader
        title="Lead Yönetimi"
        description={`${leads.length} lead kaydı listeleniyor.`}
        actions={<NewLeadDialog agents={agents} />}
      />
      <LeadsView leads={leads} />
    </>
  );
}
