import { Users2, UserPlus, Flame, CalendarClock, Building2, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentLeadsTable } from "@/components/dashboard/recent-leads-table";
import { PipelineSummary } from "@/components/dashboard/pipeline-summary";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
import { SystemStatusSummary } from "@/components/dashboard/system-status-summary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLeads } from "@/features/leads/queries";
import { isHotLead } from "@/features/leads/lib";
import { getAgents } from "@/features/agents/queries";
import { getProperties } from "@/features/properties/queries";
import { getFollowUps } from "@/features/followups/queries";
import { getFollowUpCounts } from "@/features/followups/lib";
import { getPipelineSummary } from "@/features/pipeline/lib";
import { getAppointments } from "@/features/appointments/queries";
import {
  getTodaysAppointments,
  getUpcomingAppointments,
} from "@/features/appointments/lib";

export default async function DashboardPage() {
  const [leads, agents, properties, appointments, followUps] = await Promise.all([
    getLeads(),
    getAgents(),
    getProperties(),
    getAppointments(),
    getFollowUps(),
  ]);

  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "yeni").length;
  const hotLeads = leads.filter(isHotLead).length;
  const activeProperties = properties.filter(
    (property) => property.status === "aktif",
  ).length;
  const todaysAppointmentsCount = getTodaysAppointments(appointments).length;
  const pendingFollowUps = getFollowUpCounts(followUps).pending;

  const recentLeads = [...leads]
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const pipelineStages = getPipelineSummary(leads);
  const upcomingAppointments = getUpcomingAppointments(appointments);

  return (
    <>
      <PageHeader
        title="Ana Dashboard"
        description="Emlak operasyonunuzun genel görünümü."
        actions={<QuickActions agents={agents} />}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Toplam Lead" value={String(totalLeads)} icon={Users2} accent />
        <StatCard label="Yeni Lead" value={String(newLeads)} icon={UserPlus} />
        <StatCard label="Sıcak Lead" value={String(hotLeads)} icon={Flame} />
        <StatCard
          label="Bugünkü Randevular"
          value={String(todaysAppointmentsCount)}
          icon={CalendarClock}
        />
        <StatCard
          label="Aktif Portföyler"
          value={String(activeProperties)}
          icon={Building2}
        />
        <StatCard
          label="Bekleyen Follow-up"
          value={String(pendingFollowUps)}
          icon={Clock}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Son Leadler</CardTitle>
              <CardDescription>
                En son oluşturulan 5 lead kaydı.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentLeadsTable leads={recentLeads} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Satış Pipeline Özeti</CardTitle>
              <CardDescription>
                Lead&apos;lerin pipeline aşamalarına göre dağılımı.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PipelineSummary stages={pipelineStages} />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Yaklaşan Randevular</CardTitle>
              <CardDescription>Bugün ve önümüzdeki günler.</CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingAppointments appointments={upcomingAppointments} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sistem Durumu</CardTitle>
              <CardDescription>Backend ve otomasyon sağlığı.</CardDescription>
            </CardHeader>
            <CardContent>
              <SystemStatusSummary />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
