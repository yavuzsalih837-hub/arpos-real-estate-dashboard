import { PageHeader } from "@/components/shared/page-header";
import { AppointmentsView } from "@/features/appointments/components/appointments-view";
import { getAppointments } from "@/features/appointments/queries";

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <>
      <PageHeader
        title="Randevu ve Takvim"
        description="Gösterim, görüşme ve imza randevularının takvimi."
      />
      <AppointmentsView appointments={appointments} />
    </>
  );
}
