import { PageHeader } from "@/components/shared/page-header";
import { FollowUpsView } from "@/features/followups/components/followups-view";
import { mockFollowUps } from "@/features/followups/data";
import { simulateNetworkDelay } from "@/lib/utils";

export default async function FollowUpsPage() {
  await simulateNetworkDelay();

  return (
    <>
      <PageHeader
        title="Follow-up Merkezi"
        description="Follow-up Engine tarafından planlanan takip ve yeniden iletişim görevleri."
      />
      <FollowUpsView followUps={mockFollowUps} />
    </>
  );
}
