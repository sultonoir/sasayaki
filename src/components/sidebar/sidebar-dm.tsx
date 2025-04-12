"use client";
import React from "react";
import { PlusIcon } from "lucide-react";
import FriendIcon from "../ui/friend-icon";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";

const SidebarDm = React.memo(() => {
  return (
    <>
      <SidebarHeader className="px-0">
        <SidebarMenu>
          <SidebarMenuItem className="p-2 pt-0">
            <SidebarMenuButton variant="accent">
              Find or start conversations
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator className="mx-0" />
          <SidebarMenuItem className="p-2">
            <SidebarMenuButton variant="accent">
              <FriendIcon />
              Friends
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="mx-0" />
      <SidebarContent>
        <div className="group flex items-center justify-between p-2">
          <p className="group-hover:text-primary-foreground text-muted-foreground text-xs">
            Direct Messages
          </p>
          <PlusIcon className="group-hover:text-primary-foreground text-muted-foreground size-3 text-xs" />
        </div>
        <div className="flex grow flex-col overflow-y-auto p-2">
          <div className="min-h-screen">2</div>
        </div>
      </SidebarContent>
    </>
  );
});

SidebarDm.displayName = "SidebarDm";

export default SidebarDm;
