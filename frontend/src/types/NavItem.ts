import type { UserRole } from "@/types/User";
import { type LucideIcon } from "lucide-react";

export interface INavItem {
  title: string;
  url: string; // Used for linking and active state matching
  icon?: LucideIcon;
  isActive?: boolean; // Default open state for collapsibles
  roles?: UserRole[]; // Who can see this section? (undefined = everyone)
  items?: {
    title: string;
    url: string;
    roles?: UserRole[]; // Who can see this specific link?
  }[];
}
