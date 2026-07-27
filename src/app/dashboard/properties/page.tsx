import { PageHeader } from "@/components/shared/page-header";
import { PropertiesView } from "@/features/properties/components/properties-view";
import { getProperties } from "@/features/properties/queries";

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <>
      <PageHeader
        title="Portföy Yönetimi"
        description={`${properties.length} portföy kaydı listeleniyor.`}
      />
      <PropertiesView properties={properties} />
    </>
  );
}
