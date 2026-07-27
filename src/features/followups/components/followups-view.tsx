"use client";

import { useMemo, useState } from "react";
import { addDays } from "date-fns";
import {
  AlertTriangle,
  CalendarClock,
  CalendarDays,
  ListChecks,
  Percent,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ComingSoonButton } from "@/components/shared/coming-soon-button";
import { ViewToggle, type ViewToggleOption } from "@/components/shared/view-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FollowUpsFilters,
  type FollowUpFilterValues,
} from "@/features/followups/components/followups-filters";
import { FollowUpsGrid } from "@/features/followups/components/followups-grid";
import { FollowUpsTable } from "@/features/followups/components/followups-table";
import { FollowUpSummaryList } from "@/features/followups/components/followup-summary-list";
import { FollowUpDetailSheet } from "@/features/followups/components/followup-detail-sheet";
import { DEMO_TODAY } from "@/features/appointments/data";
import {
  getCompletionRate,
  getFollowUpCounts,
  isDueToday,
  isOverdue,
  isUpcomingFollowUp,
  matchesDateRange,
} from "@/features/followups/lib";
import type { FollowUp } from "@/features/followups/types";
import { toNaiveISOString } from "@/lib/utils";

const DEFAULT_FILTERS: FollowUpFilterValues = {
  search: "",
  leadId: "all",
  agentId: "all",
  status: "all",
  channel: "all",
  dateRange: "all",
};

type ViewMode = "list" | "card";

const VIEW_OPTIONS: ViewToggleOption<ViewMode>[] = [
  { value: "card", label: "Kart görünümü", icon: CalendarDays },
  { value: "list", label: "Liste görünümü", icon: ListChecks },
];

export function FollowUpsView({
  followUps: initialFollowUps,
}: {
  followUps: FollowUp[];
}) {
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [filters, setFilters] = useState<FollowUpFilterValues>(DEFAULT_FILTERS);
  const [selectedFollowUpId, setSelectedFollowUpId] = useState<string | null>(null);

  const counts = useMemo(() => getFollowUpCounts(followUps), [followUps]);
  const completionRate = useMemo(() => getCompletionRate(followUps), [followUps]);

  const todaysFollowUps = useMemo(() => followUps.filter(isDueToday), [followUps]);
  const overdueFollowUps = useMemo(() => followUps.filter(isOverdue), [followUps]);
  const upcomingFollowUps = useMemo(
    () =>
      followUps
        .filter(isUpcomingFollowUp)
        .sort(
          (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
        ),
    [followUps],
  );

  const filteredFollowUps = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return followUps
      .filter((followUp) => {
        if (filters.leadId !== "all" && followUp.leadId !== filters.leadId) {
          return false;
        }
        if (filters.agentId !== "all" && followUp.agentId !== filters.agentId) {
          return false;
        }
        if (filters.status !== "all" && followUp.status !== filters.status) {
          return false;
        }
        if (filters.channel !== "all" && followUp.channel !== filters.channel) {
          return false;
        }
        if (!matchesDateRange(followUp, filters.dateRange)) {
          return false;
        }
        if (!search) return true;

        return followUp.leadName.toLowerCase().includes(search);
      })
      .sort(
        (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
      );
  }, [followUps, filters]);

  const selectedFollowUp =
    followUps.find((followUp) => followUp.id === selectedFollowUpId) ?? null;

  function updateFollowUp(
    id: string,
    updater: (followUp: FollowUp) => FollowUp,
  ) {
    setFollowUps((current) =>
      current.map((followUp) => (followUp.id === id ? updater(followUp) : followUp)),
    );
  }

  function handleComplete(id: string) {
    updateFollowUp(id, (followUp) => ({
      ...followUp,
      status: "tamamlandi",
      history: [
        ...followUp.history,
        {
          id: `${followUp.id}-h${followUp.history.length + 1}`,
          at: toNaiveISOString(DEMO_TODAY),
          label: "Tamamlandı olarak işaretlendi.",
        },
      ],
    }));
    toast.success("Takip tamamlandı olarak işaretlendi.");
  }

  function handleCancel(id: string) {
    updateFollowUp(id, (followUp) => ({
      ...followUp,
      status: "iptal",
      history: [
        ...followUp.history,
        {
          id: `${followUp.id}-h${followUp.history.length + 1}`,
          at: toNaiveISOString(DEMO_TODAY),
          label: "İptal edildi.",
        },
      ],
    }));
    toast.success("Takip iptal edildi.");
  }

  function handlePostpone(id: string, days: number) {
    updateFollowUp(id, (followUp) => ({
      ...followUp,
      dueAt: toNaiveISOString(addDays(new Date(followUp.dueAt), days)),
      history: [
        ...followUp.history,
        {
          id: `${followUp.id}-h${followUp.history.length + 1}`,
          at: toNaiveISOString(DEMO_TODAY),
          label: `${days} gün ertelendi.`,
        },
      ],
    }));
    toast.success("Takip ertelendi.");
  }

  function handleReschedule(id: string) {
    updateFollowUp(id, (followUp) => ({
      ...followUp,
      status: "bekliyor",
      dueAt: toNaiveISOString(addDays(DEMO_TODAY, 1)),
      history: [
        ...followUp.history,
        {
          id: `${followUp.id}-h${followUp.history.length + 1}`,
          at: toNaiveISOString(DEMO_TODAY),
          label: "Yeniden planlandı.",
        },
      ],
    }));
    toast.success("Takip yeniden planlandı.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Bugünkü Takipler"
          value={String(counts.dueToday)}
          icon={CalendarClock}
          accent
        />
        <StatCard label="Geciken Takipler" value={String(counts.overdue)} icon={AlertTriangle} />
        <StatCard label="Yaklaşan Takipler" value={String(counts.upcoming)} icon={CalendarDays} />
        <StatCard
          label="Tamamlanma Oranı"
          value={`%${completionRate}`}
          icon={Percent}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bugünkü Takipler</CardTitle>
            <CardDescription>Bugün yapılması gereken takipler.</CardDescription>
          </CardHeader>
          <CardContent>
            <FollowUpSummaryList
              followUps={todaysFollowUps}
              onSelect={(followUp) => setSelectedFollowUpId(followUp.id)}
              emptyLabel="Bugün için bekleyen takip yok"
            />
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-base text-destructive">
              <AlertTriangle className="size-4" />
              Geciken Takipler
            </CardTitle>
            <CardDescription>Planlanan tarihi geçmiş takipler.</CardDescription>
          </CardHeader>
          <CardContent>
            <FollowUpSummaryList
              followUps={overdueFollowUps}
              onSelect={(followUp) => setSelectedFollowUpId(followUp.id)}
              emptyLabel="Geciken takip yok"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Yaklaşan Takipler</CardTitle>
            <CardDescription>Önümüzdeki günlerde planlanan takipler.</CardDescription>
          </CardHeader>
          <CardContent>
            <FollowUpSummaryList
              followUps={upcomingFollowUps}
              onSelect={(followUp) => setSelectedFollowUpId(followUp.id)}
              emptyLabel="Yaklaşan takip yok"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <FollowUpsFilters
            followUps={followUps}
            values={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
          <div className="flex shrink-0 items-center gap-2">
            <ViewToggle value={viewMode} onChange={setViewMode} options={VIEW_OPTIONS} />
            <ComingSoonButton icon={Plus} label="Yeni Takip Ekle" size="sm" />
          </div>
        </div>

        {filteredFollowUps.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Sonuç bulunamadı"
            description="Filtrelere uygun takip bulunmuyor. Filtreleri temizleyip tekrar deneyebilirsiniz."
          />
        ) : viewMode === "card" ? (
          <FollowUpsGrid
            followUps={filteredFollowUps}
            onSelect={(followUp) => setSelectedFollowUpId(followUp.id)}
          />
        ) : (
          <FollowUpsTable
            followUps={filteredFollowUps}
            onSelect={(followUp) => setSelectedFollowUpId(followUp.id)}
          />
        )}
      </div>

      <FollowUpDetailSheet
        followUp={selectedFollowUp}
        onOpenChange={(open) => !open && setSelectedFollowUpId(null)}
        onComplete={handleComplete}
        onCancel={handleCancel}
        onPostpone={handlePostpone}
        onReschedule={handleReschedule}
      />
    </div>
  );
}
