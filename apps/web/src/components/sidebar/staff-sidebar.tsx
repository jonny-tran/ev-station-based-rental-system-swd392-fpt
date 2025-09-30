"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  QrCode,
  Car,
  FileText,
  CheckCircle,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Staff navigation items
const getStaffNavItems = (pathname: string) => [
  {
    title: "Trang chính",
    url: "/staff",
    icon: LayoutDashboard,
    isActive: pathname === "/staff",
  },
  {
    title: "Quét mã QR",
    url: "/staff/qr-scan",
    icon: QrCode,
    isActive: pathname.startsWith("/staff/qr-scan"),
  },
  {
    title: "Phiên Check-in",
    url: "/staff/checkin-session",
    icon: CheckCircle,
    isActive: pathname.startsWith("/staff/checkin-session"),
  },
  {
    title: "Hợp đồng",
    url: "/staff/contract",
    icon: FileText,
    isActive: pathname.startsWith("/staff/contract"),
  },
  {
    title: "Quản lý xe trả",
    url: "/staff/return",
    icon: Car,
    isActive: pathname.startsWith("/staff/return"),
  },
];

const data = {
  user: {
    name: "Staff User",
    email: "staff@example.com",
    avatar: "/avatars/staff.jpg",
  },
};

export function StaffSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const navItems = getStaffNavItems(pathname);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Car className="h-6 w-6 text-blue-600" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">EV Rental</span>
            <span className="text-xs text-muted-foreground">
              Staff Dashboard
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
