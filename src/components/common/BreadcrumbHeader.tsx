"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMemo } from "react";

interface BreadcrumbItemType {
  label: string;
  path: string;
}

const BreadcrumbHeader = () => {
  const pathname = usePathname();

  const generateBreadcrumbs = (path: string): BreadcrumbItemType[] => {
    const paths = path.replace(/\/$/, "").split("/").filter(Boolean);

    if (paths[0] === "dashboard" && paths.length === 1) {
      return [{ label: "Dashboard", path: "/dashboard" }];
    }

    return paths.map((segment, index) => ({
      label: segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      path: "/" + paths.slice(0, index + 1).join("/"),
    }));
  };

  const breadcrumbs = useMemo(
    () => generateBreadcrumbs(pathname),
    [pathname]
  );

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <BreadcrumbItem
                key={item.path}
                className="hidden md:block"
              >
                {index > 0 && <BreadcrumbSeparator />}
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.path}>
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default BreadcrumbHeader;
