"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { useSession } from "@/lib/session/session-context";
import { roleOptionFor } from "@/lib/data/roles";
import { UserMenu } from "@/components/layout/user-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function DashboardShell({
  panelLabel,
  navItems,
  pageSubtitle,
  children,
}: {
  panelLabel: string;
  navItems: DashboardNavItem[];
  pageSubtitle?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { session } = useSession();
  const userName = session.nombre || panelLabel;
  const userRoleLabel = roleOptionFor(session.role)?.label ?? "Datos de prueba";
  const pageTitle = navItems.find((item) => item.href === pathname)?.label ?? panelLabel;

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader className="px-3 py-4">
          <Link href="/" className="flex items-center gap-2.5 px-1">
            <Image src="/Nova-PNG.png" alt="" width={28} height={28} className="shrink-0 rounded-full" />
            <span className="text-sm font-bold text-white">{panelLabel}</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="gap-3 border-t border-sidebar-border px-3 py-3">
          <div className="flex items-center gap-2.5 px-1">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-[#2FA6A1] text-xs font-bold text-white">
                {userName
                  .split(" ")
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-white">{userName}</div>
              <div className="truncate text-xs text-[#8FA9C4]">{userRoleLabel}</div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted">
        <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <Breadcrumb className="hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={navItems[0]?.href ?? "/"}>{panelLabel}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-lg font-extrabold text-primary sm:text-xl">{pageTitle}</h1>
              {pageSubtitle ? (
                <p className="text-xs text-muted-foreground">{pageSubtitle}</p>
              ) : null}
            </div>
          </div>
          <UserMenu />
        </header>
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
