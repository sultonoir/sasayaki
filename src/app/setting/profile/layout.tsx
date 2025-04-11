import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-hidden border p-0 shadow-lg duration-200 sm:rounded-lg md:max-h-[570px] md:max-w-[700px] lg:max-w-[800px]">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "200px",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" side="left" collapsible="offcanvas" />
        <SidebarInset className="h-fit">{children}</SidebarInset>
      </SidebarProvider>
    </div>
  );
}
