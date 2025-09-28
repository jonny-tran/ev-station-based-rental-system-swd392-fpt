"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, FileText, Car } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// EV Rental System data
const getNavItems = (pathname: string) => [
  {
    title: "Trang chủ",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: pathname === "/dashboard",
  },
  {
    title: "Đặt xe",
    url: "/dashboard/booking",
    icon: Calendar,
    isActive: pathname.startsWith("/dashboard/booking"),
  },
  {
    title: "Hợp đồng",
    url: "/dashboard/contract",
    icon: FileText,
    isActive: pathname.startsWith("/dashboard/contract"),
  },
];

const data = {
  user: {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: "/avatars/user.jpg",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const navItems = getNavItems(pathname);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Car className="h-6 w-6 text-blue-600" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">EV Rental</span>
            <span className="text-xs text-muted-foreground">
              Hệ thống thuê xe điện
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
