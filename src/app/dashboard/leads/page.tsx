import { PageHeader } from "@/components/shared/page-header";
import { LeadsView } from "@/features/leads/components/leads-view";
import { mockLeads } from "@/features/leads/data";
import { simulateNetworkDelay } from "@/lib/utils";

export default async function LeadsPage() {
  await simulateNetworkDelay();

  return (
    <>
      <PageHeader
        title="Lead Yönetimi"
        description={`${mockLeads.length} lead kaydı listeleniyor.`}
      />
      <LeadsView leads={mockLeads} />
    </>
  );
}
