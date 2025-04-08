"use client";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import SidebarDm from "./sidebar-dm";
import SidebarChannel from "./sidebar-channel";

const SidebarHome = () => {
  const pathname = usePathname();
  const { server } = useParams();

  return (
    <div className="flex h-full w-full min-w-0 flex-col rounded-tl-xl border-t border-l">
      {pathname === "/" && <SidebarDm />}
      {server && <SidebarChannel />}
    </div>
  );
};

export default SidebarHome;
