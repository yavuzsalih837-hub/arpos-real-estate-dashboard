"use client";

import { RouteError } from "@/components/shared/route-error";

export default function MessagesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      title="Mesajlar yüklenemedi"
      description="WhatsApp konuşmaları getirilirken bir hata oluştu. Tekrar denemek verileri yeniden yükler."
      reset={reset}
    />
  );
}
