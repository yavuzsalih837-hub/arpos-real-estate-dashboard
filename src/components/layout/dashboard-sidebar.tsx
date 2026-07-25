import Link from "next/link";
import { LogoMark } from "@/components/shared/logo-mark";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { siteConfig } from "@/config/site";

export function DashboardSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card md:flex md:flex-col">
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <LogoMark />
          <div className="leading-tight">
            <p className="text-sm font-semibold">{siteConfig.shortName}</p>
            <p className="text-xs text-muted-foreground">Real Estate OS</p>
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav />
      </div>
    </aside>
  );
}
