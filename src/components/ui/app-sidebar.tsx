import * as React from "react";
import { AlertCircle, FileText, Server } from "lucide-react";
import { NavUser } from "@/components/ui/nav-user";
import { TeamSwitcher } from "@/components/ui/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Collapsible } from "@radix-ui/react-collapsible";
import { CollapsibleTrigger } from "./collapsible";
import Link from "next/link";

const links = [
  { label: "Incidents", href: "/incidents", icon: AlertCircle },
  { label: "Services", href: "/services", icon: Server },
  { label: "Logs", href: "/logs", icon: FileText },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <Collapsible
                  key={item.label}
                  asChild
                  defaultOpen={pathname === item.href}
                  className="group/collapsible"
                >
                  <SidebarMenuItem key={item.label}>
                    <CollapsibleTrigger asChild>
                      <Link href={item.href}>
                        <SidebarMenuButton
                          className="cursor-pointer"
                          tooltip={item.label}
                          isActive={pathname === item.href}
                        >
                          {item.icon && <item.icon />}
                          {item.label}
                        </SidebarMenuButton>
                      </Link>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
