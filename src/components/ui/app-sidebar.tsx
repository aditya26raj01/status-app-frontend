import * as React from "react";
import {
  AlertCircle,
  FileText,
  Monitor,
  Server,
  SquareArrowOutUpRight,
  Users,
} from "lucide-react";
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
import { useRouter } from "next/router";
import { Collapsible } from "@radix-ui/react-collapsible";
import { CollapsibleTrigger } from "./collapsible";
import Link from "next/link";

const links = [
  { label: "Incidents", href: "/incidents", icon: AlertCircle },
  { label: "Services", href: "/services", icon: Server },
  // { label: "Teams", href: "/teams", icon: Users },
  { label: "Logs", href: "/logs", icon: FileText },
  { label: "Status", href: "/status", icon: Monitor },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

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
                  className="group/collapsible"
                >
                  <SidebarMenuItem key={item.label}>
                    <CollapsibleTrigger asChild>
                      <Link
                        href={
                          item.href === "/status"
                            ? `/status/${router.query.org}`
                            : `/orgs/${router.query.org}/${item.href}`
                        }
                        target={item.href === "/status" ? "_blank" : undefined}
                      >
                        <SidebarMenuButton
                          className="cursor-pointer"
                          tooltip={item.label}
                          isActive={
                            router.pathname.includes(item.href) ||
                            router.pathname === item.href
                          }
                        >
                          {item.icon && <item.icon />}
                          {item.label}
                          {item.href === "/status" && (
                            <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                              <SquareArrowOutUpRight className="w-4 h-4" />
                              {router.query.org}
                            </span>
                          )}
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
