"use client";

import { RouteError } from "@/components/shared/route-error";

export default function LeadsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      title="Lead listesi yüklenemedi"
      description="Lead verileri getirilirken bir hata oluştu. Tekrar denemek verileri yeniden yükler."
      reset={reset}
    />
  );
}
