"use client";

import { RouteError } from "@/components/shared/route-error";

export default function PropertiesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      title="Portföy listesi yüklenemedi"
      description="Portföy verileri getirilirken bir hata oluştu. Tekrar denemek verileri yeniden yükler."
      reset={reset}
    />
  );
}
