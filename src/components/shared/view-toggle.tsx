"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewToggleOption<T extends string> = {
  value: T;
  label: string;
  icon: LucideIcon;
};

type ViewToggleProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: ViewToggleOption<T>[];
};

export function ViewToggle<T extends string>({
  value,
  onChange,
  options,
}: ViewToggleProps<T>) {
  return (
    <div className="inline-flex shrink-0 items-center gap-0.5 rounded-md border bg-card p-0.5">
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            aria-label={option.label}
            className={cn(
              "flex items-center justify-center rounded-sm p-1.5 text-muted-foreground transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <option.icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
