import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import SessionProvider from "@/provider/session-provider";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "350px",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
      <SessionProvider />
      <Toaster richColors position="top-center" />
    </>
  );
}
