"use client";

import { RouteError } from "@/components/shared/route-error";

export default function PipelineError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      title="Pipeline yüklenemedi"
      description="Satış pipeline verileri getirilirken bir hata oluştu. Tekrar denemek verileri yeniden yükler."
      reset={reset}
    />
  );
}
