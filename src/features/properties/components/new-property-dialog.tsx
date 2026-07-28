"use client";

import { useState, type ComponentProps } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
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
import { createProperty } from "@/features/properties/actions";
import {
  PROPERTY_STATUS_LABELS,
  PROPERTY_TRANSACTION_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  type PropertyStatus,
  type PropertyTransactionType,
  type PropertyType,
} from "@/features/properties/types";
import type { Agent } from "@/features/agents/types";

const UNASSIGNED_AGENT = "unassigned";
const PROPERTY_TYPE_VALUES = Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[];
const PROPERTY_STATUS_VALUES = Object.keys(
  PROPERTY_STATUS_LABELS,
) as PropertyStatus[];
const PROPERTY_TRANSACTION_TYPE_VALUES = Object.keys(
  PROPERTY_TRANSACTION_TYPE_LABELS,
) as PropertyTransactionType[];

const propertyFormSchema = z.object({
  title: z.string().trim().min(2, "Başlık en az 2 karakter olmalı."),
  description: z.string().trim().optional(),
  price: z
    .string()
    .trim()
    .min(1, "Fiyat girilmelidir.")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: "Geçerli bir fiyat girin.",
    }),
  city: z.string().trim().min(2, "Şehir en az 2 karakter olmalı."),
  district: z.string().trim().min(2, "İlçe en az 2 karakter olmalı."),
  neighborhood: z.string().trim().optional(),
  propertyType: z
    .string()
    .refine((value) => PROPERTY_TYPE_VALUES.includes(value as PropertyType), {
      message: "Portföy tipi seçilmelidir.",
    }),
  transactionType: z
    .string()
    .refine(
      (value) =>
        PROPERTY_TRANSACTION_TYPE_VALUES.includes(
          value as PropertyTransactionType,
        ),
      { message: "İşlem tipi seçilmelidir." },
    ),
  rooms: z.string().trim().optional(),
  areaM2: z
    .string()
    .trim()
    .min(1, "Alan (m²) girilmelidir.")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, {
      message: "Geçerli bir alan (m²) girin.",
    }),
  status: z
    .string()
    .refine((value) => PROPERTY_STATUS_VALUES.includes(value as PropertyStatus), {
      message: "Durum seçilmelidir.",
    }),
  agentId: z.string(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const DEFAULT_VALUES: PropertyFormValues = {
  title: "",
  description: "",
  price: "",
  city: "",
  district: "",
  neighborhood: "",
  propertyType: "",
  transactionType: "",
  rooms: "",
  areaM2: "",
  status: "aktif",
  agentId: UNASSIGNED_AGENT,
};

type NewPropertyDialogProps = {
  agents: Agent[];
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
};

export function NewPropertyDialog({
  agents,
  variant = "default",
  size = "default",
}: NewPropertyDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset(DEFAULT_VALUES);
    }
  }

  async function onSubmit(values: PropertyFormValues) {
    const { error } = await createProperty({
      title: values.title.trim(),
      description: values.description?.trim() || null,
      price: Number(values.price),
      city: values.city.trim(),
      district: values.district.trim(),
      neighborhood: values.neighborhood?.trim() || null,
      propertyType: values.propertyType as PropertyType,
      transactionType: values.transactionType as PropertyTransactionType,
      rooms: values.rooms?.trim() || undefined,
      areaM2: Number(values.areaM2),
      status: values.status as PropertyStatus,
      agentId: values.agentId === UNASSIGNED_AGENT ? null : values.agentId,
    });

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Portföy başarıyla eklendi.");
    handleOpenChange(false);
    router.refresh();
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={<Button variant={variant} size={size} />}>
        <Building2 className="size-4" />
        Portföy Ekle
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Yeni Portföy Ekle</SheetTitle>
          <SheetDescription>
            Zorunlu alanlar (*) ile işaretlidir.
          </SheetDescription>
        </SheetHeader>

        <form
          id="new-property-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="property-title" className="text-sm font-medium">
              Başlık *
            </label>
            <Input
              id="property-title"
              {...register("title")}
              placeholder="Örn. Deniz Manzaralı 3+1 Daire"
            />
            {errors.title ? (
              <span className="text-xs text-destructive">
                {errors.title.message}
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Portföy Tipi *</span>
              <Controller
                control={control}
                name="propertyType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROPERTY_TYPE_LABELS).map(
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
              {errors.propertyType ? (
                <span className="text-xs text-destructive">
                  {errors.propertyType.message}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">İşlem Tipi *</span>
              <Controller
                control={control}
                name="transactionType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROPERTY_TRANSACTION_TYPE_LABELS).map(
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
              {errors.transactionType ? (
                <span className="text-xs text-destructive">
                  {errors.transactionType.message}
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="property-city" className="text-sm font-medium">
                Şehir *
              </label>
              <Input
                id="property-city"
                {...register("city")}
                placeholder="Örn. İstanbul"
              />
              {errors.city ? (
                <span className="text-xs text-destructive">
                  {errors.city.message}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="property-district" className="text-sm font-medium">
                İlçe *
              </label>
              <Input
                id="property-district"
                {...register("district")}
                placeholder="Örn. Kadıköy"
              />
              {errors.district ? (
                <span className="text-xs text-destructive">
                  {errors.district.message}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="property-neighborhood" className="text-sm font-medium">
              Mahalle
            </label>
            <Input
              id="property-neighborhood"
              {...register("neighborhood")}
              placeholder="Örn. Caddebostan"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="property-price" className="text-sm font-medium">
                Fiyat (TRY) *
              </label>
              <Input
                id="property-price"
                type="number"
                min={0}
                step={10000}
                {...register("price")}
                placeholder="0"
              />
              {errors.price ? (
                <span className="text-xs text-destructive">
                  {errors.price.message}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="property-area" className="text-sm font-medium">
                Alan (m²) *
              </label>
              <Input
                id="property-area"
                type="number"
                min={1}
                step={1}
                {...register("areaM2")}
                placeholder="0"
              />
              {errors.areaM2 ? (
                <span className="text-xs text-destructive">
                  {errors.areaM2.message}
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="property-rooms" className="text-sm font-medium">
                Oda Sayısı
              </label>
              <Input
                id="property-rooms"
                {...register("rooms")}
                placeholder="Örn. 3+1"
              />
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
                      {Object.entries(PROPERTY_STATUS_LABELS).map(
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
            <label htmlFor="property-description" className="text-sm font-medium">
              Açıklama
            </label>
            <Textarea
              id="property-description"
              {...register("description")}
              placeholder="İlan açıklaması ekleyin..."
            />
          </div>
        </form>

        <SheetFooter className="border-t">
          <Button type="submit" form="new-property-form" disabled={isSubmitting}>
            {isSubmitting ? "Kaydediliyor..." : "Portföy Ekle"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
