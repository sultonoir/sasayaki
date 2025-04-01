"use client";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import Image from "next/image";

const ChatHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="bg-background sticky top-0 z-50 flex shrink-0 items-center gap-2 rounded-t-lg border-b p-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Image src="/avatar.png" alt="group" />
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
