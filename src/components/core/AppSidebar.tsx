"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { PiDoor, PiGraduationCap, PiStudent } from "react-icons/pi";

import { NavProjects } from "@/components/fragments/NavProjects";
import { NavUser } from "@/components/fragments/NavUser";
import { TeamSwitcher } from "@/components/fragments/TeamSwitcher";
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
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.guru} text="Guru" />
        <NavProjects projects={data.murid} text="Siswa" />
        <NavProjects projects={data.ruangan} text="Ruangan" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
