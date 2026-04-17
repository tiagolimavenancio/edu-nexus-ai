import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/provider/ThemeProvider";
import { cn } from "@/lib/utils";

export const ThemeToogle = () => {
  const { setTheme, theme } = useTheme();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className={cn("gap-2", isCollapsed ? "flex-row space-y-2" : "flex justify-end")}>
      <SidebarMenuItem title={"Choose Light Theme"}>
        <Button
          size={"icon-sm"}
          variant={theme === "light" ? "outline" : "ghost"}
          onClick={() => setTheme("light")}
        >
          <Sun />
        </Button>
      </SidebarMenuItem>
      <SidebarMenuItem title={"Choose Dark Theme"}>
        <Button
          size={"icon-sm"}
          variant={theme === "dark" ? "outline" : "ghost"}
          onClick={() => setTheme("dark")}
        >
          <Moon />
        </Button>
      </SidebarMenuItem>
      <SidebarMenuItem title={"Choose System Theme"}>
        <Button
          size={"icon-sm"}
          variant={theme === "system" ? "outline" : "ghost"}
          onClick={() => setTheme("system")}
        >
          <Laptop />
        </Button>
      </SidebarMenuItem>
    </div>
  );
};
