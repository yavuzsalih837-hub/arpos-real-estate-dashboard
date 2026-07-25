import { PageHeader } from "@/components/shared/page-header";
import { LeadsView } from "@/features/leads/components/leads-view";
import { getLeads } from "@/features/leads/queries";

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <>
      <PageHeader
        title="Lead Yönetimi"
        description={`${leads.length} lead kaydı listeleniyor.`}
      />
      <LeadsView leads={leads} />
    </>
  );
}
