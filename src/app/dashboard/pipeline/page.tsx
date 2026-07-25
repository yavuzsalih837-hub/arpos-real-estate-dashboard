import { PageHeader } from "@/components/shared/page-header";
import { PipelineBoard } from "@/features/pipeline/components/pipeline-board";
import { mockLeads } from "@/features/leads/data";
import { simulateNetworkDelay } from "@/lib/utils";

export default async function PipelinePage() {
  await simulateNetworkDelay();

  return (
    <>
      <PageHeader
        title="Satış Pipeline"
        description="Lead'leri sürükleyerek aşama değiştirin."
      />
      <PipelineBoard leads={mockLeads} />
    </>
  );
}
