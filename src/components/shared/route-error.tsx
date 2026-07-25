"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type RouteErrorProps = {
  title?: string;
  description?: string;
  reset: () => void;
};

export function RouteError({
  title = "Bir şeyler ters gitti",
  description = "Bu ekran yüklenirken beklenmeyen bir hata oluştu. Tekrar denemek verileri yeniden yüklemeyi dener.",
  reset,
}: RouteErrorProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-14 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-5 text-destructive" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={reset}>
        Tekrar dene
      </Button>
    </div>
  );
}
