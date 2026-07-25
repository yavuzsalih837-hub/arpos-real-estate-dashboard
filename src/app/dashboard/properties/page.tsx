import { PageHeader } from "@/components/shared/page-header";
import { PropertiesView } from "@/features/properties/components/properties-view";
import { mockProperties } from "@/features/properties/data";
import { simulateNetworkDelay } from "@/lib/utils";

export default async function PropertiesPage() {
  await simulateNetworkDelay();

  return (
    <>
      <PageHeader
        title="Portföy Yönetimi"
        description={`${mockProperties.length} portföy kaydı listeleniyor.`}
      />
      <PropertiesView properties={mockProperties} />
    </>
  );
}
