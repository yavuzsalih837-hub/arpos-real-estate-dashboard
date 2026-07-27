import { PageHeader } from "@/components/shared/page-header";
import { FollowUpsView } from "@/features/followups/components/followups-view";
import { getFollowUps } from "@/features/followups/queries";

export default async function FollowUpsPage() {
  const followUps = await getFollowUps();

  return (
    <>
      <PageHeader
        title="Follow-up Merkezi"
        description="Follow-up Engine tarafından planlanan takip ve yeniden iletişim görevleri."
      />
      <FollowUpsView followUps={followUps} />
    </>
  );
}
