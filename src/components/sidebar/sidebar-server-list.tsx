"use client";
import React from "react";
import Link from "next/link";
import { Image } from "@unpic/react/nextjs";
import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "../ui/skeleton";
import { Doc } from "@/convex/_generated/dataModel";
import { MessageCircle, PlusCircleIcon } from "lucide-react";
import { blurhashToDataUri } from "@unpic/placeholder";

import { useParams, usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";

const SidebarSever = () => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none" className="w-fit">
      <SidebarContent className="scrollbar-hidden items-center">
        <SidebarGroup className="px-0 py-2">
          <SidebarMenu className="items-center gap-3">
            <SidebarMenuItem className="px-2">
              <SidebarMenuButton
                isActive={pathname === "/"}
                variant="default"
                className="bg-sidebar-accent hover:bg-primary size-12 flex-none items-center justify-center"
                size="lg"
                tooltip={{
                  children: "Direct message",
                  hidden: false,
                }}
                asChild
              >
                <Link href="/">
                  <MessageCircle />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Wrapper />
            <SidebarMenuItem>
              <SidebarMenuButton
                variant="default"
                size="lg"
                className="bg-sidebar-accent hover:bg-primary size-12 flex-none items-center justify-center"
                tooltip={{
                  children: "Create Server",
                  hidden: false,
                }}
              >
                <PlusCircleIcon />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

function Wrapper() {
  const { isError, isPending, data } = useQuery(
    api.server.server_service.getServers,
  );

  if (isPending) {
    return (
      <>
        {Array.from({ length: 20 }).map((_, i) => (
          <SidebarMenuItem
            key={i}
            className="size-12 flex-none items-center justify-center p-0"
          >
            <Skeleton key={i} className="size-12" />
          </SidebarMenuItem>
        ))}
      </>
    );
  }

  if (isError || data.length === 0) return null;

  return (
    <SidebarMenuItem>
      {data.map((item) => (
        <Content key={item._id} content={item} />
      ))}
    </SidebarMenuItem>
  );
}

type ContentProps = Doc<"server"> & {
  image: Doc<"serverImage">;
  channel: Doc<"channel">;
  count: number;
};

function Content({ content }: { content: ContentProps }) {
  const { server } = useParams();
  const active = server === content._id;
  return (
    <div
      className={cn("relative px-2", {
        "after:bg-primary after:absolute after:inset-y-0 after:left-0 after:w-1 after:origin-left after:scale-y-100 after:rounded-full after:transition-transform after:duration-500 after:ease-out":
          active,
        "after:scale-y-0 after:transition-transform after:duration-500 after:ease-in":
          !active,
      })}
    >
      <SidebarMenuButton
        asChild
        variant="default"
        size="lg"
        isActive={active}
        className="size-12 flex-none items-center justify-center p-0"
        tooltip={{
          children: content.name,
          hidden: false,
        }}
      >
        <Link href={`/server/${content._id}/${content.channel._id}`}>
          <Image
            alt={content.name}
            src={content.image.url}
            width={48}
            height={48}
            layout="fixed"
            background={blurhashToDataUri(content.image.blur, 40, 40)}
            className="rounded-md object-cover"
          />
          {content.count > 0 && (
            <div className="bg-card absolute right-0 bottom-0 rounded-lg p-1 text-[10px] text-white">
              <span className="bg-destructive rounded-full px-1.5 py-0.5">
                {content.count}
              </span>
            </div>
          )}
        </Link>
      </SidebarMenuButton>
    </div>
  );
}

export default SidebarSever;
