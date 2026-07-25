import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold tracking-tight",
        className,
      )}
      aria-hidden="true"
    >
      A
    </div>
  );
}
