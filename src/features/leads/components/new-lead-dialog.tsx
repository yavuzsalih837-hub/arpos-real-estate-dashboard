"use client";

import { useState, type ComponentProps } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";
import { LEAD_SOURCE_LABELS, type LeadSource } from "@/features/leads/types";
import type { Agent } from "@/features/agents/types";

const UNASSIGNED_AGENT = "unassigned";
const LEAD_SOURCE_VALUES = Object.keys(LEAD_SOURCE_LABELS) as LeadSource[];

const leadFormSchema = z.object({
  name: z.string().trim().min(2, "İsim en az 2 karakter olmalı."),
  phone: z.string().trim().min(7, "Geçerli bir telefon numarası girin."),
  email: z
    .union([z.email("Geçerli bir e-posta adresi girin."), z.literal("")])
    .optional(),
  source: z
    .string()
    .refine((value) => LEAD_SOURCE_VALUES.includes(value as LeadSource), {
      message: "Lead kaynağı seçilmelidir.",
    }),
  agentId: z.string(),
  propertyInterest: z.string().trim().optional(),
  budget: z
    .string()
    .optional()
    .refine(
      (value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= 0),
      { message: "Geçerli bir bütçe girin." },
    ),
  notes: z.string().trim().optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

const DEFAULT_VALUES: LeadFormValues = {
  name: "",
  phone: "",
  email: "",
  source: "",
  agentId: UNASSIGNED_AGENT,
  propertyInterest: "",
  budget: "",
  notes: "",
};

type NewLeadDialogProps = {
  agents: Agent[];
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
};

export function NewLeadDialog({
  agents,
  variant = "default",
  size = "default",
}: NewLeadDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset(DEFAULT_VALUES);
    }
  }

  async function onSubmit(values: LeadFormValues) {
    const supabase = createClient();
    const { error } = await supabase.from("leads").insert({
      id: crypto.randomUUID(),
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email ? values.email.trim() : null,
      source: values.source as LeadSource,
      agent_id: values.agentId === UNASSIGNED_AGENT ? null : values.agentId,
      property_interest: values.propertyInterest?.trim() || null,
      budget: values.budget ? Number(values.budget) : 0,
      notes: values.notes?.trim() || null,
    });

    if (error) {
      toast.error(`Lead eklenemedi: ${error.message}`);
      return;
    }

    toast.success("Lead başarıyla eklendi.");
    handleOpenChange(false);
    router.refresh();
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={<Button variant={variant} size={size} />}>
        <UserPlus className="size-4" />
        Yeni Lead Ekle
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Yeni Lead Ekle</SheetTitle>
          <SheetDescription>
            Zorunlu alanlar (*) ile işaretlidir.
          </SheetDescription>
        </SheetHeader>

        <form
          id="new-lead-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lead-name" className="text-sm font-medium">
              Ad Soyad *
            </label>
            <Input
              id="lead-name"
              {...register("name")}
              placeholder="Örn. Ahmet Yıldız"
            />
            {errors.name ? (
              <span className="text-xs text-destructive">
                {errors.name.message}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lead-phone" className="text-sm font-medium">
              Telefon *
            </label>
            <Input
              id="lead-phone"
              {...register("phone")}
              placeholder="+90 5xx xxx xx xx"
            />
            {errors.phone ? (
              <span className="text-xs text-destructive">
                {errors.phone.message}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lead-email" className="text-sm font-medium">
              E-posta
            </label>
            <Input
              id="lead-email"
              type="email"
              {...register("email")}
              placeholder="ornek@eposta.com"
            />
            {errors.email ? (
              <span className="text-xs text-destructive">
                {errors.email.message}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Kaynak *</span>
            <Controller
              control={control}
              name="source"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Kaynak seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LEAD_SOURCE_LABELS).map(
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
            {errors.source ? (
              <span className="text-xs text-destructive">
                {errors.source.message}
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lead-property" className="text-sm font-medium">
              İlgilendiği Gayrimenkul
            </label>
            <Input
              id="lead-property"
              {...register("propertyInterest")}
              placeholder="Örn. 3+1 Daire, Kadıköy"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lead-budget" className="text-sm font-medium">
              Bütçe (TRY)
            </label>
            <Input
              id="lead-budget"
              type="number"
              min={0}
              step={10000}
              {...register("budget")}
              placeholder="0"
            />
            {errors.budget ? (
              <span className="text-xs text-destructive">
                {errors.budget.message}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lead-notes" className="text-sm font-medium">
              Notlar
            </label>
            <Textarea
              id="lead-notes"
              {...register("notes")}
              placeholder="Ek not ekleyin..."
            />
          </div>
        </form>

        <SheetFooter className="border-t">
          <Button type="submit" form="new-lead-form" disabled={isSubmitting}>
            {isSubmitting ? "Kaydediliyor..." : "Lead Ekle"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
