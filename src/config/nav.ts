import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users2,
  TrendingUp,
  Building2,
  Sparkles,
  CalendarClock,
  ListChecks,
  MessageCircle,
  UserCog,
  Activity,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const dashboardNavItems: NavItem[] = [
  { title: "Ana Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Lead Yönetimi", href: "/dashboard/leads", icon: Users2 },
  { title: "Satış Pipeline", href: "/dashboard/pipeline", icon: TrendingUp },
  { title: "Portföy Yönetimi", href: "/dashboard/properties", icon: Building2 },
  { title: "Akıllı Eşleştirmeler", href: "/dashboard/matching", icon: Sparkles },
  { title: "Randevu ve Takvim", href: "/dashboard/appointments", icon: CalendarClock },
  { title: "Follow-up Merkezi", href: "/dashboard/followups", icon: ListChecks },
  { title: "WhatsApp Mesajları", href: "/dashboard/messages", icon: MessageCircle },
  { title: "Danışman Yönetimi", href: "/dashboard/agents", icon: UserCog },
  { title: "Sistem Sağlığı", href: "/dashboard/system-health", icon: Activity },
];
