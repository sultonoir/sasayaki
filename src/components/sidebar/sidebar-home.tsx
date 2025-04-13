"use client";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import SidebarDm from "./sidebar-dm";
import SidebarChannel from "./sidebar-channel";
import { Sidebar } from "../ui/sidebar";

const SidebarHome = () => {
  const pathname = usePathname();
  const { server } = useParams();

  const isDm = pathname === "/" || pathname.startsWith("/dm");
  return (
    <Sidebar collapsible="none" className="w-full min-w-0 border-l">
      {isDm && <SidebarDm />}
      {server && <SidebarChannel />}
    </Sidebar>
  );
};

export default SidebarHome;
