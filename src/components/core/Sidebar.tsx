"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { PiDoor, PiGraduationCap, PiStudent } from "react-icons/pi";

import { NavMain } from "@/fragments/NavMain";
import { NavUser } from "@/fragments/NavUser";
import { NavLogo } from "@/fragments/NavLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ProjectItem } from "@/types/sidebar";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Team {
  name: string;
  logo: React.ComponentType;
  plan: string;
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com", 
    avatar: "/avatars/shadcn.jpg",
  } as User,
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ] as Team[],
  guru: [
    {
      id: "guru-1",
      name: "Guru",
      url: "/guru",
      icon: PiGraduationCap,
    },
  ] as ProjectItem[],
  murid: [
    {
      id: "murid-1", 
      name: "Siswa",
      url: "/siswa",
      icon: PiStudent,
    },
  ] as ProjectItem[],
  ruangan: [
    {
      id: "ruangan-1",
      name: "Ruangan", 
      url: "/ruangan",
      icon: PiDoor,
    },
  ] as ProjectItem[],
};

export const AppSidebar = React.memo(function AppSidebar({ 
  ...props 
}: React.ComponentProps<typeof Sidebar>) {
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
});
