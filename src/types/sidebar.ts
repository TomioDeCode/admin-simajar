import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

export interface ProjectItem {
    id: string;
    name: string;
    url: string;
    icon: IconType | LucideIcon;
}