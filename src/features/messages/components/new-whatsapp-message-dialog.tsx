"use client";

import { useState, type ComponentProps } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
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
import { logWhatsAppMessage } from "@/features/messages/actions";
import type { Lead } from "@/features/leads/types";

const NO_TEMPLATE = "serbest";

type MessageTemplate = {
  id: string;
  label: string;
  content: string;
};

const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: "karsilama",
    label: "Karşılama Mesajı",
    content:
      "Merhaba {{isim}}, ARPOS Gayrimenkul'den yazıyorum. Size nasıl yardımcı olabilirim?",
  },
  {
    id: "randevu-hatirlatma",
    label: "Randevu Hatırlatma",
    content:
      "Merhaba {{isim}}, yaklaşan randevunuzu hatırlatmak isteriz. Görüşmek üzere!",
  },
  {
    id: "bilgilendirme",
    label: "Genel Bilgilendirme",
    content:
      "Merhaba {{isim}}, sizinle ilgili portföyler hakkında güncel bilgi paylaşmak istedik.",
  },
];

function firstName(fullName: string | undefined): string {
  if (!fullName) return "değerli müşterimiz";
  return fullName.trim().split(" ")[0] || "değerli müşterimiz";
}

function digitsOnly(phone: string | undefined): string {
  return phone ? phone.replace(/\D/g, "") : "";
}

const whatsappFormSchema = z.object({
  leadId: z.string().trim().min(1, "Lead seçilmelidir."),
  templateId: z.string(),
  message: z.string().trim().min(1, "Mesaj girilmelidir."),
});

type WhatsAppFormValues = z.infer<typeof whatsappFormSchema>;

const DEFAULT_VALUES: WhatsAppFormValues = {
  leadId: "",
  templateId: NO_TEMPLATE,
  message: "",
};

type NewWhatsAppMessageDialogProps = {
  leads: Lead[];
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
};

export function NewWhatsAppMessageDialog({
  leads,
  variant = "outline",
  size = "sm",
}: NewWhatsAppMessageDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const leadItems = Object.fromEntries(
    leads.map((lead) => [lead.id, `${lead.name} — ${lead.phone}`]),
  );
  const templateItems: Record<string, string> = {
    [NO_TEMPLATE]: "Serbest Mesaj",
    ...Object.fromEntries(MESSAGE_TEMPLATES.map((template) => [template.id, template.label])),
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WhatsAppFormValues>({
    resolver: zodResolver(whatsappFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const leadId = useWatch({ control, name: "leadId" });
  const message = useWatch({ control, name: "message" });
  const selectedLead = leads.find((lead) => lead.id === leadId);
  const phoneDigits = digitsOnly(selectedLead?.phone);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset(DEFAULT_VALUES);
    }
  }

  function handleTemplateChange(templateId: string | null) {
    if (!templateId) return;
    setValue("templateId", templateId);
    const template = MESSAGE_TEMPLATES.find((item) => item.id === templateId);
    if (template) {
      setValue(
        "message",
        template.content.replace("{{isim}}", firstName(selectedLead?.name)),
      );
    }
  }

  async function onSubmit(values: WhatsAppFormValues) {
    if (!selectedLead) {
      toast.error("Seçilen lead bulunamadı. Lütfen tekrar deneyin.");
      return;
    }

    if (phoneDigits.length < 10) {
      toast.error("Geçerli bir telefon numarası bulunamadı.");
      return;
    }

    // window.open, popup engelleyicilere takılmamak için click handler
    // içinde await'ten ÖNCE, senkron olarak çağrılmalı.
    const waWindow = window.open(
      `https://wa.me/${phoneDigits}?text=${encodeURIComponent(values.message)}`,
      "_blank",
      "noopener,noreferrer",
    );

    if (!waWindow) {
      toast.error(
        "Tarayıcı pop-up penceresini engelledi. Lütfen pop-up izni verip tekrar deneyin.",
      );
      return;
    }

    const { error } = await logWhatsAppMessage({
      leadId: selectedLead.id,
      agentId: selectedLead.agentId || null,
      content: values.message,
    });

    if (error) {
      toast.error("WhatsApp penceresi açıldı ancak geçmişe kaydedilemedi.");
      handleOpenChange(false);
      router.refresh();
      return;
    }

    toast.success("WhatsApp penceresi açıldı.");
    handleOpenChange(false);

    if (pathname === "/dashboard/messages") {
      router.refresh();
    } else {
      router.push("/dashboard/messages");
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={<Button variant={variant} size={size} />}>
        <MessageCircle className="size-4" />
        WhatsApp Mesajı Gönder
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>WhatsApp Mesajı Gönder</SheetTitle>
          <SheetDescription>
            Zorunlu alanlar (*) ile işaretlidir. Gönder&apos;e basınca
            WhatsApp mesaj hazır şekilde yeni sekmede açılır; gönderimi
            WhatsApp içinde siz tamamlarsınız.
          </SheetDescription>
        </SheetHeader>

        <form
          id="new-whatsapp-message-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
        >
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Lead *</span>
            <Controller
              control={control}
              name="leadId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  items={leadItems}
                >
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
            <label htmlFor="whatsapp-phone" className="text-sm font-medium">
              Telefon
            </label>
            <Input
              id="whatsapp-phone"
              value={selectedLead?.phone ?? ""}
              readOnly
              disabled
              placeholder="Lead seçilince otomatik gelir"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Mesaj Şablonu</span>
            <Controller
              control={control}
              name="templateId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={handleTemplateChange}
                  items={templateItems}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Şablon seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_TEMPLATE}>Serbest Mesaj</SelectItem>
                    {MESSAGE_TEMPLATES.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="whatsapp-message" className="text-sm font-medium">
              Mesaj *
            </label>
            <Textarea
              id="whatsapp-message"
              {...register("message")}
              placeholder="Mesajınızı yazın..."
              rows={4}
            />
            {errors.message ? (
              <span className="text-xs text-destructive">
                {errors.message.message}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Önizleme</span>
            <div className="rounded-lg border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
              {message?.trim() ? message : "Mesaj önizlemesi burada görünecek."}
            </div>
          </div>
        </form>

        <SheetFooter className="border-t">
          <Button
            type="submit"
            form="new-whatsapp-message-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Açılıyor..." : "Gönder"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
