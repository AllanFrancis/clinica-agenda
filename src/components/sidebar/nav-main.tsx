"use client";

import {
  CalendarDays,
  GalleryVerticalEnd,
  LayoutDashboard,
  type LucideIcon,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Icon mapping for server-client compatibility
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  GalleryVerticalEnd,
  CalendarDays,
  Stethoscope,
  UsersRound,
};

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: string | LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu principal</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Get the icon component from string name or use the component directly
          const IconComponent =
            typeof item.icon === "string" ? iconMap[item.icon] : item.icon;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className={cn(
                    "flex items-center gap-2",
                    item.isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
