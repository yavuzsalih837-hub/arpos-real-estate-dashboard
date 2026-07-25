import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeadStatusBadge } from "@/features/leads/components/lead-status-badge";
import { getAgentById } from "@/features/agents/data";
import type { Lead } from "@/features/leads/types";

export function RecentLeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lead</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Danışman</TableHead>
            <TableHead>Skor</TableHead>
            <TableHead>Son İletişim</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell>
                <LeadStatusBadge status={lead.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getAgentById(lead.agentId)?.name ?? "Atanmadı"}
              </TableCell>
              <TableCell className="tabular-nums">{lead.score}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(lead.lastContactAt), {
                  addSuffix: true,
                  locale: tr,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
