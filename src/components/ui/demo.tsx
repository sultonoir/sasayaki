"use client";
import React from "react";
import FriendIcon from "./friend-icon";
import { NavUser } from "../sidebar/nav-user";
import SidebarSever from "../sidebar/sidebar-server-list";
import ChatLoader from "../chat/chat-loader";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import SidebarHome from "../sidebar/sidebar-home";

const Demo = () => {
  const { isOpen } = useSidebar();
  return (
    <div className="flex h-svh flex-col overflow-hidden">
      <div
        className={cn(
          "ease-[cubic-bezier(0.4, 0.0, 0.2, 1)] bg-background fixed top-0 left-0 z-10 size-full shadow-xl transition-all duration-300 will-change-transform md:w-[365px]",
          {
            "-translate-x-full opacity-0": !isOpen,
            "translate-x-0 opacity-100": isOpen,
          },
        )}
      >
        <div className="flex size-full flex-col">
          <div className="mt-[56px] flex h-full flex-row overflow-x-hidden overflow-y-auto">
            <div className="flex w-[65px] flex-none flex-col gap-2 overflow-y-auto">
              <SidebarSever />
            </div>
            <SidebarHome />
          </div>
          <div className="flex-none shrink-0 p-4 pt-0">
            <NavUser />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "ease-[cubic-bezier(0.4, 0.0, 0.2, 1)] flex-1 transition-all duration-300 will-change-transform",
          {
            "ml-[365px]": isOpen,
            "ml-0": !isOpen,
          },
        )}
      >
        <div className="flex h-14 flex-none items-center justify-center gap-4 py-2">
          <FriendIcon />
          Friends
        </div>
        <div className="bg-sidebar flex size-full h-[calc(100svh-55px)] flex-col border-t border-l">
          <div className="flex size-full flex-col overflow-y-auto">
            <ChatLoader length={200} />
          </div>
          <div className="flex h-14 flex-none items-center justify-center gap-4 py-2">
            <FriendIcon />
            Friends
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
