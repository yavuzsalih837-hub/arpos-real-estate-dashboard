"use client";

import { useMemo, useState } from "react";
import { addMonths, addWeeks, subMonths, subWeeks } from "date-fns";
import { CalendarClock, CalendarDays, CheckCircle2, UserPlus, XCircle } from "lucide-react";
import { toast } from "sonner";
import { StatCard } from "@/components/dashboard/stat-card";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
import { EmptyState } from "@/components/shared/empty-state";
import { ComingSoonButton } from "@/components/shared/coming-soon-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AppointmentsFilters,
  type AppointmentFilterValues,
} from "@/features/appointments/components/appointments-filters";
import {
  AppointmentsCalendarNav,
  type CalendarViewMode,
} from "@/features/appointments/components/appointments-calendar-nav";
import { AppointmentCalendarMonth } from "@/features/appointments/components/appointment-calendar-month";
import { AppointmentCalendarWeek } from "@/features/appointments/components/appointment-calendar-week";
import { AppointmentsList } from "@/features/appointments/components/appointments-list";
import { AppointmentDetailSheet } from "@/features/appointments/components/appointment-detail-sheet";
import { DEMO_TODAY } from "@/features/appointments/data";
import {
  getConflictingAppointmentIds,
  getTodaysAppointments,
  getUpcomingAppointments,
  matchesDateRange,
} from "@/features/appointments/lib";
import type { Appointment, AppointmentStatus } from "@/features/appointments/types";

const DEFAULT_FILTERS: AppointmentFilterValues = {
  search: "",
  agentId: "all",
  status: "all",
  dateRange: "all",
};

export function AppointmentsView({
  appointments: initialAppointments,
}: {
  appointments: Appointment[];
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [currentDate, setCurrentDate] = useState(DEMO_TODAY);
  const [filters, setFilters] = useState<AppointmentFilterValues>(DEFAULT_FILTERS);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(
    null,
  );

  const conflictIds = useMemo(
    () => getConflictingAppointmentIds(appointments),
    [appointments],
  );

  const filteredAppointments = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      if (filters.agentId !== "all" && appointment.agentId !== filters.agentId) {
        return false;
      }
      if (filters.status !== "all" && appointment.status !== filters.status) {
        return false;
      }
      if (!matchesDateRange(appointment, filters.dateRange)) {
        return false;
      }
      if (!search) return true;

      return (
        appointment.leadName.toLowerCase().includes(search) ||
        appointment.propertyTitle.toLowerCase().includes(search)
      );
    });
  }, [appointments, filters]);

  const sortedListAppointments = useMemo(
    () =>
      [...filteredAppointments].sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      ),
    [filteredAppointments],
  );

  const todaysAppointments = useMemo(
    () => getTodaysAppointments(appointments),
    [appointments],
  );
  const upcomingAppointments = useMemo(
    () => getUpcomingAppointments(appointments, 5),
    [appointments],
  );
  const completedCount = appointments.filter((a) => a.status === "tamamlandi").length;
  const cancelledCount = appointments.filter((a) => a.status === "iptal").length;

  const selectedAppointment =
    appointments.find((appointment) => appointment.id === selectedAppointmentId) ??
    null;

  function handlePrev() {
    setCurrentDate((date) => (viewMode === "week" ? subWeeks(date, 1) : subMonths(date, 1)));
  }

  function handleNext() {
    setCurrentDate((date) => (viewMode === "week" ? addWeeks(date, 1) : addMonths(date, 1)));
  }

  function handleToday() {
    setCurrentDate(DEMO_TODAY);
  }

  function handleStatusChange(id: string, status: AppointmentStatus) {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment,
      ),
    );
    toast.success("Randevu durumu güncellendi.");
  }

  function handleNoteChange(id: string, note: string) {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, note } : appointment,
      ),
    );
    toast.success("Görüşme notu kaydedildi.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Bugünkü Randevular"
          value={String(todaysAppointments.length)}
          icon={CalendarClock}
          accent
        />
        <StatCard
          label="Yaklaşan Randevular"
          value={String(upcomingAppointments.length)}
          icon={CalendarDays}
        />
        <StatCard
          label="Tamamlanan"
          value={String(completedCount)}
          icon={CheckCircle2}
        />
        <StatCard label="İptal Edilen" value={String(cancelledCount)} icon={XCircle} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bugünkü Randevular</CardTitle>
            <CardDescription>Bugün için planlanan tüm randevular.</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingAppointments appointments={todaysAppointments} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Yaklaşan Randevular</CardTitle>
            <CardDescription>Bugün ve önümüzdeki günler.</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingAppointments appointments={upcomingAppointments} />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <AppointmentsFilters
            values={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
          <ComingSoonButton
            icon={UserPlus}
            label="Yeni Randevu Ekle"
            size="sm"
            className="shrink-0"
          />
        </div>

        <AppointmentsCalendarNav
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          currentDate={currentDate}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
        />

        {viewMode === "month" ? (
          <AppointmentCalendarMonth
            monthDate={currentDate}
            referenceDate={DEMO_TODAY}
            appointments={filteredAppointments}
            conflictIds={conflictIds}
            onSelectAppointment={(appointment) =>
              setSelectedAppointmentId(appointment.id)
            }
          />
        ) : viewMode === "week" ? (
          <AppointmentCalendarWeek
            weekDate={currentDate}
            referenceDate={DEMO_TODAY}
            appointments={filteredAppointments}
            conflictIds={conflictIds}
            onSelectAppointment={(appointment) =>
              setSelectedAppointmentId(appointment.id)
            }
          />
        ) : sortedListAppointments.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Sonuç bulunamadı"
            description="Filtrelere uygun randevu bulunmuyor. Filtreleri temizleyip tekrar deneyebilirsiniz."
          />
        ) : (
          <AppointmentsList
            appointments={sortedListAppointments}
            conflictIds={conflictIds}
            onSelect={(appointment) => setSelectedAppointmentId(appointment.id)}
          />
        )}
      </div>

      <AppointmentDetailSheet
        appointment={selectedAppointment}
        hasConflict={
          selectedAppointment ? conflictIds.has(selectedAppointment.id) : false
        }
        onOpenChange={(open) => !open && setSelectedAppointmentId(null)}
        onStatusChange={handleStatusChange}
        onNoteChange={handleNoteChange}
      />
    </div>
  );
}
