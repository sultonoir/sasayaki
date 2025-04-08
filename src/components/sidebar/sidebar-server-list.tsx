"use client";
import React from "react";
import Link from "next/link";
import { Image } from "@unpic/react/nextjs";
import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "../ui/skeleton";
import { Doc } from "@/convex/_generated/dataModel";
import { MessageCircle, PlusCircleIcon } from "lucide-react";
import { useDialogServer } from "@/hooks/use-dialog-server";
import { blurhashToDataUri } from "@unpic/placeholder";

import {
  Tooltip,
  TooltipButton,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const SidebarSever = () => {
  const { setOpen } = useDialogServer();
  return (
    <div className="flex size-full min-h-0 flex-1 flex-col items-center gap-3 overflow-x-hidden overflow-y-auto">
      <TooltipButton
        asChild
        className="bg-sidebar-accent hover:bg-primary size-10 flex-none items-center justify-center"
        tooltip={{
          children: "Direct message",
          hidden: false,
        }}
      >
        <Link href="/">
          <MessageCircle />
        </Link>
      </TooltipButton>
      <Wrapper />
      <TooltipButton
        className="bg-sidebar-accent hover:bg-primary size-10 flex-none items-center justify-center"
        tooltip={{
          children: "Create Server",
          hidden: false,
        }}
        onClick={setOpen}
      >
        <PlusCircleIcon />
      </TooltipButton>
    </div>
  );
};

function Wrapper() {
  const { isError, isPending, data } = useQuery(
    api.server.server_service.getServers,
  );

  if (isPending) {
    return (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="size-10 rounded-full" />
        ))}
      </>
    );
  }

  if (isError || data.length === 0) return null;

  return (
    <>
      {data.map((item) => (
        <Content key={item._id} content={item} />
      ))}
    </>
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
      className={cn("relative px-3", {
        "after:bg-primary relative overflow-hidden rounded-none after:pointer-events-none after:absolute after:inset-y-0 after:left-0 after:w-1 after:rounded-full":
          active,
      })}
    >
      <Tooltip key={content._id}>
        <TooltipTrigger key={content._id} asChild>
          <Link href={`/server/${content._id}/${content.channel._id}`}>
            <Image
              alt={content.name}
              src={content.image.url}
              width={40}
              height={40}
              layout="fixed"
              background={blurhashToDataUri(content.image.blur, 40, 40)}
              className="rounded-lg object-cover"
            />
            {content.count > 0 && (
              <div className="bg-destructive absolute right-1 bottom-0 rounded-lg px-1.5 py-0.5 text-[10px] text-white">
                {content.count}
              </div>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          {content.name}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default SidebarSever;
