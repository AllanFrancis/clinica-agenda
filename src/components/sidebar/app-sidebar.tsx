import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as React from "react";

import { ClinicSwitcher } from "@/components/sidebar/clinic-switcher";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

// Navigation data - using icon names instead of components
const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Clínicas",
    url: "/clinics",
    icon: "GalleryVerticalEnd",
  },
  {
    title: "Agendamentos",
    url: "/appointments",
    icon: "CalendarDays",
  },
  {
    title: "Médicos",
    url: "/doctors",
    icon: "Stethoscope",
  },
  {
    title: "Pacientes",
    url: "/patients",
    icon: "UsersRound",
  },
];

export async function AppSidebarServer({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  const user = {
    id: session.user.id,
    name: session.user.name || "Usuário",
    email: session.user.email || "",
    emailVerified: session.user.emailVerified,
    createdAt: session.user.createdAt,
    updatedAt: session.user.updatedAt,
    image: session.user.image || "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {" "}
      <SidebarHeader>
        <ClinicSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
