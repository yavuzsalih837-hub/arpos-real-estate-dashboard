"use client";

import { useState, type ComponentProps } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createAppointment } from "@/features/appointments/actions";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_LABELS,
  type AppointmentStatus,
  type AppointmentType,
} from "@/features/appointments/types";
import type { Agent } from "@/features/agents/types";
import type { Lead } from "@/features/leads/types";
import type { Property } from "@/features/properties/types";

const UNASSIGNED_AGENT = "unassigned";
const APPOINTMENT_TYPE_VALUES = Object.keys(
  APPOINTMENT_TYPE_LABELS,
) as AppointmentType[];
const APPOINTMENT_STATUS_VALUES = Object.keys(
  APPOINTMENT_STATUS_LABELS,
) as AppointmentStatus[];

const DURATION_OPTIONS = [30, 45, 60, 90] as const;

const appointmentFormSchema = z.object({
  leadId: z.string().trim().min(1, "Lead seçilmelidir."),
  propertyId: z.string().trim().min(1, "Portföy seçilmelidir."),
  agentId: z.string(),
  type: z
    .string()
    .refine((value) => APPOINTMENT_TYPE_VALUES.includes(value as AppointmentType), {
      message: "Randevu tipi seçilmelidir.",
    }),
  status: z
    .string()
    .refine(
      (value) => APPOINTMENT_STATUS_VALUES.includes(value as AppointmentStatus),
      { message: "Durum seçilmelidir." },
    ),
  date: z.string().trim().min(1, "Tarih girilmelidir."),
  time: z.string().trim().min(1, "Saat girilmelidir."),
  durationMinutes: z
    .string()
    .refine((value) => DURATION_OPTIONS.includes(Number(value) as (typeof DURATION_OPTIONS)[number]), {
      message: "Süre seçilmelidir.",
    }),
  note: z.string().trim().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

const DEFAULT_VALUES: AppointmentFormValues = {
  leadId: "",
  propertyId: "",
  agentId: UNASSIGNED_AGENT,
  type: "",
  status: "planlandi",
  date: "",
  time: "",
  durationMinutes: "30",
  note: "",
};

type NewAppointmentDialogProps = {
  leads: Lead[];
  agents: Agent[];
  properties: Property[];
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
};

export function NewAppointmentDialog({
  leads,
  agents,
  properties,
  variant = "outline",
  size = "sm",
}: NewAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset(DEFAULT_VALUES);
    }
  }

  async function onSubmit(values: AppointmentFormValues) {
    const selectedLead = leads.find((lead) => lead.id === values.leadId);
    const selectedProperty = properties.find(
      (property) => property.id === values.propertyId,
    );

    if (!selectedLead || !selectedProperty) {
      toast.error("Seçilen lead veya portföy bulunamadı. Lütfen tekrar deneyin.");
      return;
    }

    const scheduledAt = new Date(`${values.date}T${values.time}`);
    if (Number.isNaN(scheduledAt.getTime())) {
      toast.error("Geçerli bir tarih ve saat girin.");
      return;
    }

    const { error } = await createAppointment({
      leadId: selectedLead.id,
      leadName: selectedLead.name,
      agentId: values.agentId === UNASSIGNED_AGENT ? null : values.agentId,
      propertyId: selectedProperty.id,
      propertyTitle: selectedProperty.title,
      type: values.type as AppointmentType,
      status: values.status as AppointmentStatus,
      scheduledAt: scheduledAt.toISOString(),
      durationMinutes: Number(values.durationMinutes),
      note: values.note?.trim() || null,
    });

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Randevu başarıyla oluşturuldu.");
    handleOpenChange(false);
    router.refresh();
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={<Button variant={variant} size={size} />}>
        <CalendarPlus className="size-4" />
        Randevu Oluştur
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Yeni Randevu Oluştur</SheetTitle>
          <SheetDescription>
            Zorunlu alanlar (*) ile işaretlidir.
          </SheetDescription>
        </SheetHeader>

        <form
          id="new-appointment-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
        >
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Lead *</span>
            <Controller
              control={control}
              name="leadId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Lead seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.name} — {lead.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.leadId ? (
              <span className="text-xs text-destructive">
                {errors.leadId.message}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Portföy *</span>
            <Controller
              control={control}
              name="propertyId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Portföy seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.propertyId ? (
              <span className="text-xs text-destructive">
                {errors.propertyId.message}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Danışman</span>
            <Controller
              control={control}
              name="agentId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Danışman seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UNASSIGNED_AGENT}>Atanmadı</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Randevu Tipi *</span>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(APPOINTMENT_TYPE_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type ? (
                <span className="text-xs text-destructive">
                  {errors.type.message}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Durum *</span>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(APPOINTMENT_STATUS_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status ? (
                <span className="text-xs text-destructive">
                  {errors.status.message}
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="appointment-date" className="text-sm font-medium">
                Tarih *
              </label>
              <Input id="appointment-date" type="date" {...register("date")} />
              {errors.date ? (
                <span className="text-xs text-destructive">
                  {errors.date.message}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="appointment-time" className="text-sm font-medium">
                Saat *
              </label>
              <Input id="appointment-time" type="time" {...register("time")} />
              {errors.time ? (
                <span className="text-xs text-destructive">
                  {errors.time.message}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Süre *</span>
            <Controller
              control={control}
              name="durationMinutes"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Süre seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((minutes) => (
                      <SelectItem key={minutes} value={String(minutes)}>
                        {minutes} dakika
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.durationMinutes ? (
              <span className="text-xs text-destructive">
                {errors.durationMinutes.message}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="appointment-note" className="text-sm font-medium">
              Notlar
            </label>
            <Textarea
              id="appointment-note"
              {...register("note")}
              placeholder="Ek not ekleyin..."
            />
          </div>
        </form>

        <SheetFooter className="border-t">
          <Button type="submit" form="new-appointment-form" disabled={isSubmitting}>
            {isSubmitting ? "Kaydediliyor..." : "Randevu Oluştur"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
