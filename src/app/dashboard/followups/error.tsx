"use client";

import { RouteError } from "@/components/shared/route-error";

export default function FollowUpsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      title="Follow-up listesi yüklenemedi"
      description="Takip verileri getirilirken bir hata oluştu. Tekrar denemek verileri yeniden yükler."
      reset={reset}
    />
  );
}
