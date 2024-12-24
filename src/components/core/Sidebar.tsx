"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { PiDoor, PiGraduationCap, PiStudent } from "react-icons/pi";

import { NavMain } from "@/components/fragments/NavMain";
import { NavUser } from "@/components/fragments/NavUser";
import { NavLogo } from "@/components/fragments/NavLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  guru: [
    {
      name: "Guru",
      url: "/guru",
      icon: PiGraduationCap,
    },
  ],
  murid: [
    {
      name: "Siswa",
      url: "/siswa",
      icon: PiStudent,
    },
  ],
  ruangan: [
    {
      name: "Ruangan",
      url: "/ruangan",
      icon: PiDoor,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain projects={data.guru} text="Guru" />
        <NavMain projects={data.murid} text="Siswa" />
        <NavMain projects={data.ruangan} text="Ruangan" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}