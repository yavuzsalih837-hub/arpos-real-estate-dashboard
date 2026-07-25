import { Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

type ContactQuickActionsProps = {
  phone?: string;
  email?: string;
  size?: "icon-sm" | "sm";
  showWhatsApp?: boolean;
  stopPropagation?: boolean;
};

export function ContactQuickActions({
  phone,
  email,
  size = "icon-sm",
  showWhatsApp = true,
  stopPropagation,
}: ContactQuickActionsProps) {
  const waNumber = phone ? phone.replace(/\D/g, "") : undefined;

  return (
    <div
      className="flex items-center gap-1.5"
      onClick={(event) => stopPropagation && event.stopPropagation()}
    >
      {showWhatsApp && waNumber ? (
        <Button
          variant="outline"
          size={size}
          render={
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp ile mesaj gönder"
            />
          }
        >
          <MessageCircle />
        </Button>
      ) : null}
      {phone ? (
        <Button
          variant="outline"
          size={size}
          render={<a href={`tel:${phone}`} aria-label="Telefonla ara" />}
        >
          <Phone />
        </Button>
      ) : null}
      {email ? (
        <Button
          variant="outline"
          size={size}
          render={<a href={`mailto:${email}`} aria-label="E-posta gönder" />}
        >
          <Mail />
        </Button>
      ) : null}
    </div>
  );
}
