import { CheckCircle2 } from "lucide-react";
import { readyBackendModules } from "@/config/site";

export function ModuleStatusList() {
  return (
    <ul className="flex flex-col gap-3">
      {readyBackendModules.map((module) => (
        <li key={module} className="flex items-center gap-2.5 text-sm">
          <CheckCircle2 className="size-4 shrink-0 text-primary" />
          <span>{module}</span>
        </li>
      ))}
    </ul>
  );
}
