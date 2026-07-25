import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { PipelineCard } from "@/features/pipeline/components/pipeline-card";
import type { Lead } from "@/features/leads/types";

type PipelineDraggableCardProps = {
  lead: Lead;
  onSelect: (lead: Lead) => void;
};

export function PipelineDraggableCard({
  lead,
  onSelect,
}: PipelineDraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: lead.id, data: { status: lead.status } });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={isDragging ? "opacity-40" : undefined}
      {...listeners}
      {...attributes}
    >
      <PipelineCard lead={lead} onSelect={onSelect} />
    </div>
  );
}
