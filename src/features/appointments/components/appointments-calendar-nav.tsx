"use client";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, LayoutList, CalendarDays, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewToggle, type ViewToggleOption } from "@/components/shared/view-toggle";
import { getWeekDays } from "@/features/appointments/lib";

export type CalendarViewMode = "month" | "week" | "list";

const VIEW_OPTIONS: ViewToggleOption<CalendarViewMode>[] = [
  { value: "month", label: "Aylık görünüm", icon: CalendarDays },
  { value: "week", label: "Haftalık görünüm", icon: CalendarRange },
  { value: "list", label: "Liste görünümü", icon: LayoutList },
];

type AppointmentsCalendarNavProps = {
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export function AppointmentsCalendarNav({
  viewMode,
  onViewModeChange,
  currentDate,
  onPrev,
  onNext,
  onToday,
}: AppointmentsCalendarNavProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        {viewMode !== "list" ? (
          <>
            <Button variant="outline" size="sm" onClick={onToday}>
              Bugün
            </Button>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Önceki"
                onClick={onPrev}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sonraki"
                onClick={onNext}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <span className="text-sm font-medium">
              {getPeriodLabel(viewMode, currentDate)}
            </span>
          </>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">
            Tüm randevular kronolojik olarak listeleniyor.
          </span>
        )}
      </div>

      <ViewToggle value={viewMode} onChange={onViewModeChange} options={VIEW_OPTIONS} />
    </div>
  );
}

function getPeriodLabel(viewMode: CalendarViewMode, date: Date): string {
  if (viewMode === "month") {
    return format(date, "MMMM yyyy", { locale: tr });
  }

  const [start, end] = [getWeekDays(date)[0], getWeekDays(date)[6]];
  const sameMonth = start.getMonth() === end.getMonth();

  return sameMonth
    ? `${format(start, "d")} - ${format(end, "d MMMM yyyy", { locale: tr })}`
    : `${format(start, "d MMMM", { locale: tr })} - ${format(end, "d MMMM yyyy", { locale: tr })}`;
}
