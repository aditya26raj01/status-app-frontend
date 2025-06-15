import React from "react";
import { useRouter } from "next/router";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./ui/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  if (router.pathname === "/") {
    return children;
  }

  if (router.pathname === "/orgs" || router.pathname === "/status/[org]") {
    return (
      <div className="container mx-auto max-w-screen-lg py-20">{children}</div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full relative">
        <div className="h-12 gap-4 flex items-center px-4 shadow-md">
          <SidebarTrigger className="cursor-pointer" />
          <div className="text-white font-bold text-xl">Status App</div>
        </div>
        <div className="container mx-auto max-w-screen-lg py-20 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
