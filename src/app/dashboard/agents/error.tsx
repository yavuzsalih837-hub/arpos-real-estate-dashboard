"use client";

import { RouteError } from "@/components/shared/route-error";

export default function AgentsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      title="Danışman listesi yüklenemedi"
      description="Danışman verileri getirilirken bir hata oluştu. Tekrar denemek verileri yeniden yükler."
      reset={reset}
    />
  );
}
