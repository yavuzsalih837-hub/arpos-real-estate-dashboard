import type { LucideIcon } from "lucide-react";

type AgentMetricProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

export function AgentMetric({ icon: Icon, label, value }: AgentMetricProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-medium tabular-nums">{value}</span>
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
