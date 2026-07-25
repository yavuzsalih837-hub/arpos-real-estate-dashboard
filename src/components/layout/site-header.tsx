import { LogoMark } from "@/components/shared/logo-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div className="leading-tight">
            <p className="text-sm font-semibold">{siteConfig.shortName}</p>
            <p className="text-xs text-muted-foreground">Real Estate OS</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
