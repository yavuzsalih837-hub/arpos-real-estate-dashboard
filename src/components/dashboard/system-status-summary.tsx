import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ModuleStatusList } from "@/components/dashboard/module-status-list";
import { automationCount } from "@/config/site";

export function SystemStatusSummary() {
  return (
    <div className="flex flex-col gap-4">
      <Badge className="w-fit gap-1.5 border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="size-3.5" />
        Tüm sistemler operasyonel
      </Badge>
      <ModuleStatusList />
      <p className="text-xs text-muted-foreground">
        {automationCount} otomasyon workflow&apos;u aktif olarak çalışıyor.
      </p>
    </div>
  );
}
