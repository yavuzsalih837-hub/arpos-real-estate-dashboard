"use client";

import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ComingSoonButtonProps = {
  icon?: LucideIcon;
  label: string;
  message?: string;
} & Omit<ComponentProps<typeof Button>, "onClick" | "children">;

export function ComingSoonButton({
  icon: Icon,
  label,
  message = "Bu özellik backend entegrasyonuyla birlikte aktif olacak.",
  ...buttonProps
}: ComingSoonButtonProps) {
  return (
    <Button onClick={() => toast.info(message)} {...buttonProps}>
      {Icon ? <Icon className="size-4" /> : null}
      {label}
    </Button>
  );
}
