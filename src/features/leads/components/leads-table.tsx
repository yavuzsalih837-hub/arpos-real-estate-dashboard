import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeadStatusBadge } from "@/features/leads/components/lead-status-badge";
import { LeadScore } from "@/features/leads/components/lead-score";
import { getAgentById } from "@/features/agents/data";
import { LEAD_SOURCE_LABELS, type Lead } from "@/features/leads/types";

type LeadsTableProps = {
  leads: Lead[];
  onSelect: (lead: Lead) => void;
};

export function LeadsTable({ leads, onSelect }: LeadsTableProps) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lead</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Kaynak</TableHead>
            <TableHead>Danışman</TableHead>
            <TableHead>Skor</TableHead>
            <TableHead>Son İletişim</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              onClick={() => onSelect(lead)}
              className="cursor-pointer"
            >
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{lead.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {lead.phone}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <LeadStatusBadge status={lead.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {LEAD_SOURCE_LABELS[lead.source]}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getAgentById(lead.agentId)?.name ?? "Atanmadı"}
              </TableCell>
              <TableCell>
                <LeadScore score={lead.score} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(lead.lastContactAt), {
                  addSuffix: true,
                  locale: tr,
                })}
              </TableCell>
              <TableCell>
                <ChevronRight className="size-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
