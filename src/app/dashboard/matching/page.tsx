import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function MatchingPage() {
  return (
    <>
      <PageHeader
        title="Akıllı Eşleştirmeler"
        description="Property Matching Engine ile otomatik lead-portföy eşleştirmeleri."
      />
      <ComingSoon icon={Sparkles} moduleName="Akıllı Eşleştirmeler" />
    </>
  );
}
