import { PageHeader } from "@/components/shared/page-header";
import { AppointmentsView } from "@/features/appointments/components/appointments-view";
import { mockAppointments } from "@/features/appointments/data";
import { simulateNetworkDelay } from "@/lib/utils";

export default async function AppointmentsPage() {
  await simulateNetworkDelay();

  return (
    <>
      <PageHeader
        title="Randevu ve Takvim"
        description="Gösterim, görüşme ve imza randevularının takvimi."
      />
      <AppointmentsView appointments={mockAppointments} />
    </>
  );
}
