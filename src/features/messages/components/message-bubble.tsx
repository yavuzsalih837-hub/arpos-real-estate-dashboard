import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Bot, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/features/messages/types";

export function MessageBubble({ message }: { message: Message }) {
  const isOutbound = message.direction === "outbound";

  return (
    <div className={cn("flex flex-col gap-1", isOutbound ? "items-end" : "items-start")}>
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1 rounded-lg px-3 py-2 text-sm sm:max-w-[65%]",
          isOutbound
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted text-foreground",
        )}
      >
        {message.automated ? (
          <span
            className={cn(
              "flex items-center gap-1 text-[11px]",
              isOutbound ? "text-primary-foreground/70" : "text-muted-foreground",
            )}
          >
            <Bot className="size-3" />
            Otomatik yanıt
          </span>
        ) : null}
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
      <div className="flex items-center gap-1 px-1 text-[11px] text-muted-foreground">
        <span>{format(new Date(message.sentAt), "d MMM, HH:mm", { locale: tr })}</span>
        {isOutbound ? <DeliveryIcon status={message.deliveryStatus} /> : null}
      </div>
    </div>
  );
}

function DeliveryIcon({ status }: { status: Message["deliveryStatus"] }) {
  if (status === "okundu") {
    return <CheckCheck className="size-3.5 text-primary" />;
  }
  if (status === "iletildi") {
    return <CheckCheck className="size-3.5" />;
  }
  return <Check className="size-3.5" />;
}
