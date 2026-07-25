import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

type ComingSoonProps = {
  icon?: LucideIcon;
  moduleName: string;
};

export function ComingSoon({ icon = Construction, moduleName }: ComingSoonProps) {
  return (
    <EmptyState
      icon={icon}
      title={`${moduleName} yakında burada`}
      description="Bu modül dashboard altyapısı kurulduktan sonra aşamalı olarak devreye alınacak."
    />
  );
}
