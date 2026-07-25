import { Activity } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function SystemHealthPage() {
  return (
    <>
      <PageHeader
        title="Sistem Sağlığı"
        description="Backend modülleri ve otomasyon hatlarının canlı durumu."
      />
      <ComingSoon icon={Activity} moduleName="Sistem Sağlığı" />
    </>
  );
}
