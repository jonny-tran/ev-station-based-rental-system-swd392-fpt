"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/stores/auth.store";
import { useLogout } from "@/hooks/use-logout";

export function NavUser() {
  const { user } = useAuth();
  const { logout, isLoggingOut } = useLogout();
  const { isMobile } = useSidebar();

  if (!user) return null;

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "Staff":
        return "Staff";
      case "Renter":
        return "Renter";
      case "Admin":
        return "Admin";
      default:
        return role;
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                  {getInitials(user.fullName, user.email)}
                </AvatarFallback>
              </Avatar>
              <div
                className="grid flex-1 text-left text-sm leading-tight"
                suppressHydrationWarning={true}
              >
                <span className="truncate font-medium">
                  {user.fullName || "User"}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                    {getInitials(user.fullName, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="grid flex-1 text-left text-sm leading-tight"
                  suppressHydrationWarning={true}
                >
                  <span className="truncate font-medium">
                    {user.fullName || "User"}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account Information
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} disabled={isLoggingOut}>
              <LogOut />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
