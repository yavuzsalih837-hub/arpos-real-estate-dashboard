import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  CalendarClock,
  CalendarX,
  Flame,
  Home,
  Mail,
  Phone,
  Users2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { formatCurrencyTRY } from "@/lib/utils";
import { AgentAvatar } from "@/features/agents/components/agent-avatar";
import { AgentStatusBadge } from "@/features/agents/components/agent-status-badge";
import { AgentMetric } from "@/features/agents/components/agent-metric";
import { AgentTrend } from "@/features/agents/components/agent-trend";
import { EmptyState } from "@/components/shared/empty-state";
import {
  getAgentAppointments,
  getAgentLeads,
  getAgentPerformance,
  getAgentProperties,
} from "@/features/agents/lib";
import { LeadStatusBadge } from "@/features/leads/components/lead-status-badge";
import { PropertyStatusBadge } from "@/features/properties/components/property-status-badge";
import { APPOINTMENT_TYPE_LABELS } from "@/features/appointments/types";
import type { Agent } from "@/features/agents/types";

type AgentDetailSheetProps = {
  agent: Agent | null;
  onOpenChange: (open: boolean) => void;
};

export function AgentDetailSheet({ agent, onOpenChange }: AgentDetailSheetProps) {
  const performance = agent ? getAgentPerformance(agent.id) : null;
  const recentLeads = agent ? getAgentLeads(agent.id, 5) : [];
  const properties = agent ? getAgentProperties(agent.id, 5) : [];
  const appointments = agent ? getAgentAppointments(agent.id, 5) : [];

  return (
    <Sheet open={agent !== null} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        {agent && performance ? (
          <>
            <SheetHeader className="border-b">
              <div className="flex items-center gap-3">
                <AgentAvatar initials={agent.initials} status={agent.status} size="lg" />
                <div className="flex flex-col">
                  <SheetTitle>{agent.name}</SheetTitle>
                  <span className="text-xs text-muted-foreground">
                    {agent.specialty}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <AgentStatusBadge status={agent.status} />
                <span className="text-xs text-muted-foreground">{agent.region}</span>
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>{agent.email}</span>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                <AgentMetric icon={Users2} label="Toplam Lead" value={performance.totalLeads} />
                <AgentMetric icon={Flame} label="Sıcak Lead" value={performance.hotLeads} />
                <AgentMetric icon={Home} label="Aktif Portföy" value={performance.activeProperties} />
                <AgentMetric icon={CalendarClock} label="Randevu" value={performance.appointmentsCount} />
              </div>

              <Separator />

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Performans Puanı</span>
                  <span className="font-medium tabular-nums">
                    {performance.performanceScore}/100
                  </span>
                </div>
                <Progress value={performance.performanceScore} />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Satış / Dönüşüm Oranı</span>
                  <span className="font-medium">
                    {performance.wonDeals} satış · %{performance.conversionRate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Toplam Satış Değeri</span>
                  <span className="font-medium text-primary">
                    {formatCurrencyTRY(performance.salesValue)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Bu Ay / Geçen Ay</span>
                <AgentTrend
                  label="Lead Sayısı"
                  current={performance.thisMonth.leads}
                  previous={performance.lastMonth.leads}
                />
                <AgentTrend
                  label="Kapanan Satış"
                  current={performance.thisMonth.wonDeals}
                  previous={performance.lastMonth.wonDeals}
                />
                <AgentTrend
                  label="Satış Değeri"
                  current={performance.thisMonth.salesValue}
                  previous={performance.lastMonth.salesValue}
                  formatValue={formatCurrencyTRY}
                />
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Son Leadler</span>
                {recentLeads.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Bu danışmana atanmış lead bulunmuyor.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {recentLeads.map((lead) => (
                      <li
                        key={lead.id}
                        className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm"
                      >
                        <span className="truncate font-medium">{lead.name}</span>
                        <LeadStatusBadge status={lead.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Portföyler</span>
                {properties.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Bu danışmana atanmış portföy bulunmuyor.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {properties.map((property) => (
                      <li
                        key={property.id}
                        className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm"
                      >
                        <span className="truncate font-medium">{property.title}</span>
                        <PropertyStatusBadge status={property.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Randevular</span>
                {appointments.length === 0 ? (
                  <EmptyState
                    icon={CalendarX}
                    title="Randevu yok"
                    description="Bu danışman için planlanmış randevu bulunmuyor."
                    compact
                  />
                ) : (
                  <ul className="flex flex-col gap-2">
                    {appointments.map((appointment) => (
                      <li
                        key={appointment.id}
                        className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{appointment.leadName}</span>
                          <span className="text-xs text-muted-foreground">
                            {APPOINTMENT_TYPE_LABELS[appointment.type]} ·{" "}
                            {appointment.propertyTitle}
                          </span>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(appointment.scheduledAt), {
                            addSuffix: true,
                            locale: tr,
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
