"use client";

import * as React from "react";
import { Sidebar, SidebarFooter } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import SidebarSever from "./sidebar-server-list";
import SidebarHome from "./sidebar-home";

export function SidebarApp({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="[&>[data-sidebar=sidebar]]:flex-col"
      variant="floating"
      {...props}
    >
      <Sidebar collapsible="none" className="w-full flex-row overflow-hidden">
        <SidebarSever />
        <SidebarHome />
      </Sidebar>
      <SidebarFooter className="pt-0">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
