"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { type IconType } from "react-icons";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";

interface ProjectItem {
  name: string;
  url: string;
  icon: LucideIcon | IconType;
}

interface NavProjectsProps {
  projects: ProjectItem[];
  text: string;
}

export function NavProjects({ projects, text }: NavProjectsProps) {
  return (
    <SidebarGroup className="-mt-2.5">
      <SidebarGroupLabel className="flex items-center gap-2">
        <span>{text}</span>
      </SidebarGroupLabel>

      <SidebarMenu>
        {projects.map((project) => (
          <SidebarMenuItem key={project.name}>
            <SidebarMenuButton
              asChild
              tooltip={project.name}
              className="group/project relative"
            >
              <Link href={project.url} className="flex items-center gap-2">
                <project.icon className="size-4 shrink-0 text-gray-500 group-hover/project:text-blue-500 transition-colors" />
                <span className="flex-1 truncate">{project.name}</span>

                <ChevronRight className="size-4 text-gray-400 opacity-0 group-hover/project:opacity-100 transition-all" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
