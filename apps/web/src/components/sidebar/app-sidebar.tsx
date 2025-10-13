"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, FileText } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

// EV Rental System data
const getNavItems = (pathname: string) => [
  {
    title: "Home",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: pathname === "/dashboard",
  },
  {
    title: "Booking",
    url: "/dashboard/booking",
    icon: Calendar,
    isActive: pathname.startsWith("/dashboard/booking"),
  },
  {
    title: "Contract",
    url: "/dashboard/contract",
    icon: FileText,
    isActive: pathname.startsWith("/dashboard/contract"),
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const navItems = getNavItems(pathname);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// Component riêng cho logo để xử lý animation
function SidebarLogo() {
  const { state } = useSidebar();

  return (
    <div className="flex px-2 py-3">
      <div className="flex items-center justify-center gap-2 transition-all duration-300 ease-in-out">
        {/* Logo image - luôn hiện */}
        <Image
          src="https://res.cloudinary.com/dmhjgnymn/image/upload/v1760269195/logo_EVRenter_SWD392_c1qh8d.png"
          alt="EVRenter Logo"
          width={40}
          height={40}
          className="object-contain h-10 w-10"
        />

        {/* Text logo - chỉ hiện khi expanded */}
        {state === "expanded" && (
          <span className="text-lg font-bold text-sidebar-foreground whitespace-nowrap transition-all duration-300 ease-in-out">
            EVRenter
          </span>
        )}
      </div>
    </div>
  );
}
