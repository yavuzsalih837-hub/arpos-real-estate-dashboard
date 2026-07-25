import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { AlertTriangle, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { FollowUpStatusBadge } from "@/features/followups/components/followup-status-badge";
import { FollowUpPriorityBadge } from "@/features/followups/components/followup-priority-badge";
import { FollowUpChannelTag } from "@/features/followups/components/followup-channel";
import { getAgentById } from "@/features/agents/data";
import { isOverdue } from "@/features/followups/lib";
import type { FollowUp } from "@/features/followups/types";

type FollowUpsTableProps = {
  followUps: FollowUp[];
  onSelect: (followUp: FollowUp) => void;
};

export function FollowUpsTable({ followUps, onSelect }: FollowUpsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Müşteri</TableHead>
            <TableHead>Danışman</TableHead>
            <TableHead>Takip Türü</TableHead>
            <TableHead>Öncelik</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Planlanan Tarih</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {followUps.map((followUp) => {
            const overdue = isOverdue(followUp);

            return (
              <TableRow
                key={followUp.id}
                onClick={() => onSelect(followUp)}
                className="cursor-pointer"
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{followUp.leadName}</span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {followUp.note}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {getAgentById(followUp.agentId)?.name ?? "Atanmadı"}
                </TableCell>
                <TableCell>
                  <FollowUpChannelTag channel={followUp.channel} />
                </TableCell>
                <TableCell>
                  <FollowUpPriorityBadge priority={followUp.priority} />
                </TableCell>
                <TableCell>
                  <FollowUpStatusBadge followUp={followUp} />
                </TableCell>
                <TableCell
                  className={cn(
                    "tabular-nums",
                    overdue ? "font-medium text-destructive" : "text-muted-foreground",
                  )}
                >
                  <span className="flex items-center gap-1">
                    {overdue ? <AlertTriangle className="size-3.5" /> : null}
                    {format(new Date(followUp.dueAt), "d MMMM yyyy, HH:mm", {
                      locale: tr,
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
