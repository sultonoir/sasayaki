"use client";
import React from "react";
import { PlusIcon } from "lucide-react";
import FriendIcon from "../ui/friend-icon";
import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "../ui/sidebar";
import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "../ui/skeleton";
import { UserAvatar } from "../user/user-avatar";
import Link from "next/link";

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
      <SidebarContent className="gap-0">
        <div className="group/dm flex items-center justify-between p-2">
          <p className="group-hover/dm:text-primary-foreground text-muted-foreground text-xs">
            Direct Messages
          </p>
          <PlusIcon className="group-hover:text-primary-foreground text-muted-foreground size-3 text-xs" />
        </div>
        <SidebarGroup className="scrollbar-hidden flex grow flex-col overflow-y-auto p-2">
          <Content />
        </SidebarGroup>
      </SidebarContent>
    </>
  );
});

function Content() {
  const { toggleSidebar, isMobile } = useSidebar();
  const { isPending, isError, data } = useQuery(
    api.personal.personal_service.getDms
  );

  if (isPending) {
    return (
      <SidebarMenu>
        {Array.from({ length: 20 }).map((_, index) => (
          <SidebarMenuItem
            className="flex items-center space-x-4"
            key={index}>
            <Skeleton className="h-12 w-12 flex-none rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }

  if (isError || data.length === 0) return null;

  return (
    <SidebarMenu>
      {data.map((pm) => (
        <SidebarMenuItem key={pm.id}>
          <SidebarMenuButton
            className="h-fit"
            onClick={() => {
              if (isMobile) {
                toggleSidebar();
              }
            }}
            asChild>
            <Link
              href={`/dm/${pm.id}/${pm.userId}`}
              prefetch={true}>
              <UserAvatar
                src={pm.image}
                blur={pm.blur}
                online={pm.online}
              />
              <p className="text-sm">{pm.name}</p>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

SidebarDm.displayName = "SidebarDm";

export default SidebarDm;
