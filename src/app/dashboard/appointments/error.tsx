"use client";

import { RouteError } from "@/components/shared/route-error";

export default function AppointmentsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      title="Randevu takvimi yüklenemedi"
      description="Randevu verileri getirilirken bir hata oluştu. Tekrar denemek verileri yeniden yükler."
      reset={reset}
    />
  );
}
