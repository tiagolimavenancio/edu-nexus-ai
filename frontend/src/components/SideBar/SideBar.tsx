import { LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import { useLocation, useNavigate } from "react-router";

import { useMemo } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/AuthProvider";
import type { UserRole } from "@/types/User";
import type { INavItem } from "@/types/NavItem";

import { ThemeToogle } from "@/components/ThemeToogle";
import { NavMain, NavUser } from "@/components/NavBar";
import { TeamSwitcher } from "@/components/TeamSwitcher";
import { Settings2, School, GraduationCap, Users, LayoutDashboard, Banknote } from "lucide-react";

const menuItems = {
  teams: [
    {
      name: "Springfield High",
      logo: School,
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      roles: ["admin", "teacher", "student", "parent"],
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          roles: ["admin", "teacher", "student", "parent"],
        },
        {
          title: "Activities Log",
          url: "/activies-log",
          roles: ["admin"], // Restricted to Admin
        },
      ],
    },
    {
      title: "Academics",
      url: "#", // Parent item, no link
      icon: School,
      roles: ["admin", "teacher", "student", "parent"],
      items: [
        {
          title: "Classes",
          url: "/classes",
          roles: ["admin", "teacher"],
        },
        {
          title: "Subjects",
          url: "/subjects",
          roles: ["admin", "teacher"],
        },
        {
          title: "Timetable",
          url: "/timetable",
          // Everyone needs to see the schedule
        },
        {
          title: "Attendance",
          url: "/attendance",
          // Parents want to see if their kid was present
        },
      ],
    },
    {
      title: "Learning (LMS)",
      url: "#",
      icon: GraduationCap,
      roles: ["teacher", "student", "admin"], // Parents usually don't need deep LMS access
      items: [
        { title: "Assignments", url: "/lms/assignments" },
        { title: "Exams", url: "/lms/exams" },
        { title: "Study Materials", url: "/lms/materials" },
      ],
    },
    {
      title: "People",
      url: "#",
      icon: Users,
      roles: ["admin", "teacher"],
      items: [
        { title: "Students", url: "/users/students" },
        {
          title: "Teachers",
          url: "/users/teachers",
          roles: ["admin"], // Only Admin can see other Admins
        },
        {
          title: "Parents",
          url: "/users/parents",
          roles: ["admin"], // Only Admin can see other Admins
        },
        {
          title: "Admins",
          url: "/users/admins",
          roles: ["admin"], // Only Admin can see other Admins
        },
      ],
    },
    {
      title: "Finance",
      url: "#",
      icon: Banknote,
      roles: ["admin"],
      items: [
        { title: "Fee Collection", url: "/finance/fees" },
        { title: "Expenses", url: "/finance/expenses" },
        { title: "Salary", url: "/finance/salary" },
      ],
    },
    {
      title: "System",
      url: "#",
      icon: Settings2,
      roles: ["admin"],
      items: [
        { title: "School Settings", url: "/settings/general" }, // Added to match router
        { title: "Academic Years", url: "/settings/academic-years" },
        { title: "Roles & Permissions", url: "/settings/roles" },
      ],
    },
  ] as INavItem[],
};

export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const location = useLocation(); // <--- Get current URL
  const { user, year, setUser } = useAuth();
  const { state } = useSidebar();

  const pathname = location.pathname; // e.g., "/dashboard/analytics"
  const isCollapsed = state === "collapsed";

  const userData = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: "",
  };

  const userRole = (user?.role || "student") as UserRole;

  const filteredNav = useMemo(() => {
    return menuItems.navMain
      .filter((item) => !item.roles || item.roles.includes(userRole))
      .map((item) => {
        const isChildActive = item.items?.some((sub) => sub.url === pathname);
        const isMainActive = item.url === pathname;

        return {
          ...item,
          isActive: isMainActive || isChildActive,
          items: item.items
            ?.filter((subItem) => !subItem.roles || subItem.roles.includes(userRole))
            .map((subItem) => ({
              ...subItem,
              isActive: subItem.url === pathname,
            })),
        };
      });
  }, [pathname, userRole]);

  const logout = async () => {
    try {
      await api.post("/users/logout").finally(() => {
        setUser(null);
        navigate("/login");
        toast.success("Logged out successfully");
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={menuItems.teams} yearName={year?.name} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNav} />
      </SidebarContent>
      <SidebarFooter>
        <div className={cn("gap-2", isCollapsed ? "flex-row space-y-2" : "flex justify-between")}>
          <SidebarMenuItem title="Logout">
            <Button onClick={logout} variant={"ghost"} size="icon-sm">
              <LogOut />
            </Button>
          </SidebarMenuItem>
          <ThemeToogle />
        </div>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
