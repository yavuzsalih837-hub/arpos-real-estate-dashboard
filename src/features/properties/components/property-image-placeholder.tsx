import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PropertyImagePlaceholderProps = {
  className?: string;
  iconClassName?: string;
};

export function PropertyImagePlaceholder({
  className,
  iconClassName,
}: PropertyImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex aspect-video w-full items-center justify-center rounded-md bg-muted",
        className,
      )}
    >
      <ImageIcon className={cn("size-6 text-muted-foreground/60", iconClassName)} />
    </div>
  );
}
