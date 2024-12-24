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
import { memo } from "react";

interface ProjectItem {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon | IconType;
}

interface NavMainProps {
  projects: ProjectItem[];
  text: string;
}

export const NavMain = memo(function NavMain({ projects, text }: NavMainProps) {
  return (
    <SidebarGroup className="-mt-2.5">
      <SidebarGroupLabel className="flex items-center gap-2">
        <span className="font-medium">{text}</span>
      </SidebarGroupLabel>

      <SidebarMenu>
        {projects.map((project) => (
          <SidebarMenuItem key={project.id || project.name}>
            <SidebarMenuButton
              asChild
              tooltip={project.name}
              className="group/project relative hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
            >
              <Link
                href={project.url}
                className="flex items-center gap-3 px-2 py-1.5 rounded-md transition-all duration-200"
              >
                <project.icon
                  className="size-4 shrink-0 text-gray-500 group-hover/project:text-blue-500 transition-colors duration-200"
                  aria-hidden="true"
                />
                <span className="flex-1 truncate text-sm">{project.name}</span>
                <ChevronRight
                  className="size-4 text-gray-400 opacity-0 group-hover/project:opacity-100 transition-all duration-200"
                  aria-hidden="true"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
});
