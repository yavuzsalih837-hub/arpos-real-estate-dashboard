import { FollowUpCard } from "@/features/followups/components/followup-card";
import { getLeadById } from "@/features/leads/data";
import type { FollowUp } from "@/features/followups/types";

type FollowUpsGridProps = {
  followUps: FollowUp[];
  onSelect: (followUp: FollowUp) => void;
};

export function FollowUpsGrid({ followUps, onSelect }: FollowUpsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {followUps.map((followUp) => {
        const lead = getLeadById(followUp.leadId);

        return (
          <FollowUpCard
            key={followUp.id}
            followUp={followUp}
            phone={lead?.phone}
            email={lead?.email}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}
