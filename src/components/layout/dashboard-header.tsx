"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LogoMark } from "@/components/shared/logo-mark";
import { dashboardNavItems } from "@/config/nav";
import { signOut } from "@/app/logout/actions";

export function DashboardHeader() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeItem = dashboardNavItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`)),
  );

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-card px-4 sm:px-6">
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
              aria-label="Menüyü aç"
            />
          }
        >
          <Menu className="size-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b">
            <SheetTitle className="flex items-center gap-3">
              <LogoMark />
              ARPOS
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <h2 className="flex-1 truncate text-sm font-medium sm:text-base">
        {activeItem?.title ?? "Dashboard"}
      </h2>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <Avatar>
          <AvatarFallback>OY</AvatarFallback>
        </Avatar>
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            aria-label="Çıkış yap"
          >
            <LogOut className="size-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
