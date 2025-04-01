import React from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";
import { MessageSquare } from "lucide-react";
import { Image } from "@unpic/react/nextjs";
import { fromNow } from "@/lib/from-now";
import Link from "next/link";

const ChatLists = () => {
  return (
    <SidebarGroup>
      <Content />
    </SidebarGroup>
  );
};

function Content() {
  const { data, isPending, isError } = useQuery(
    api.chat.chat_service.chatlists,
  );
  if (isPending) {
    return <Loader />;
  }

  if (isError || data.length === 0) {
    return (
      <div className="flex h-[700px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <span className="bg-accent inline-flex size-12 items-center justify-center rounded-full">
            <MessageSquare />
          </span>
          <span>You dont have messages</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarMenu>
      {data.map((item) => (
        <SidebarMenuItem key={item._id}>
          <SidebarMenuButton className="flex h-fit w-full" asChild>
            <Link href={`/${item._id}`} prefetch={true}>
              <Image
                className="flex-none rounded-full object-cover"
                src={item.image}
                alt={item.name}
                layout="constrained"
                width={40}
                height={40}
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold capitalize">{item.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {fromNow(new Date(item.lastMessageTime))}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="line-clamp-1 text-xs">
                    {item.lastMessage}
                  </span>
                </div>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function Loader() {
  return (
    <div className="grid grid-cols-1 gap-2">
      {Array.from({ length: 14 }).map((_, index) => (
        <div className="flex items-center space-x-4" key={index}>
          <Skeleton className="h-12 w-12 flex-none rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatLists;
