import { Progress } from "@/components/ui/progress";
import type { PipelineStageSummary } from "@/features/pipeline/lib";

export function PipelineSummary({
  stages,
}: {
  stages: PipelineStageSummary[];
}) {
  const total = Math.max(
    stages.reduce((sum, stage) => sum + stage.count, 0),
    1,
  );

  return (
    <div className="flex flex-col gap-4">
      {stages.map((stage) => (
        <div key={stage.status} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span>{stage.label}</span>
            <span className="tabular-nums text-muted-foreground">
              {stage.count}
            </span>
          </div>
          <Progress value={(stage.count / total) * 100} />
        </div>
      ))}
    </div>
  );
}
