"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import React, { memo } from "react";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface NavUserProps {
  user: User;
}

export const NavUser = memo(function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();

  const renderUserInfo = () => (
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="rounded-lg">
          {user.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{user.name}</span>
        <span className="truncate text-xs">{user.email}</span>
      </div>
    </div>
  );

  const menuItems = [
    {
      group: "upgrade",
      items: [
        { icon: Sparkles, label: "Upgrade to Pro" }
      ]
    },
    {
      group: "account",
      items: [
        { icon: BadgeCheck, label: "Account" },
        { icon: CreditCard, label: "Billing" },
        { icon: Bell, label: "Notifications" }
      ]
    },
    {
      group: "actions",
      items: [
        { icon: LogOut, label: "Log out" }
      ]
    }
  ];

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
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              {renderUserInfo()}
            </DropdownMenuLabel>
            {menuItems.map((group, index) => (
              <React.Fragment key={group.group}>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {group.items.map((item) => (
                    <DropdownMenuItem key={item.label}>
                      <item.icon className="size-4 mr-2" />
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
});
