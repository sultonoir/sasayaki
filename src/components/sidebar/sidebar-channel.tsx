"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  CalendarIcon,
  Edit,
  Hash,
  LockIcon,
  PlusIcon,
  Trash2Icon,
  UserPlus,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDialogCreateChannel } from "@/hooks/use-dialog-create-channel";
import { useDialogRmChannel } from "@/hooks/use-dialog-remove-channel";
import ServerDropdown from "../server/server-dropdown";
import { useSidebar } from "../ui/sidebar";

const SidebarChannel = React.memo(() => {
  const { setOpen, setId } = useDialogCreateChannel();
  const { server } = useParams<{ server: string }>();

  const { data, isPending, isError } = useQuery(
    api.server.server_service.getServerByid,
    {
      id: server as unknown as Id<"server">,
    },
  );

  if (isPending) {
    return (
      <div className="flex size-full flex-col gap-2 overflow-y-auto p-4">
        {Array.from({ length: 200 }).map((_, index) => (
          <Skeleton className="h-9 w-[230px] flex-none" key={index} />
        ))}
      </div>
    );
  }

  if (isError || !data) return null;

  const accessCreate = data.owner || !!data.access.create;

  return (
    <>
      <div className="flex w-full flex-col gap-2 border-b p-2">
        <ServerDropdown {...data} />
      </div>
      {accessCreate && (
        <div className="flex w-full flex-col gap-2 border-b p-2">
          <Button
            className="justify-start"
            variant="ghost"
            size="sm"
            startContent={<CalendarIcon />}
          >
            Create Event
          </Button>
        </div>
      )}
      <div className="group text-muted-foreground hover:text-primary-foreground flex items-center justify-between px-4 py-2 text-xs">
        <p className="w-full">Text Channels</p>
        {accessCreate && (
          <Tooltip>
            <TooltipTrigger
              onClick={() => {
                setOpen(true);
                setId({
                  id: data._id,
                  name: "",
                  isPrivate: false,
                  type: "crete",
                });
              }}
            >
              <PlusIcon className="size-3" />
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              Create Channel
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex grow flex-col gap-2 overflow-y-auto p-2">
        {data.channel.map((ch) => (
          <Channel
            key={ch._id}
            ch={ch}
            owner={data.owner}
            access={data.access}
            count={ch.count}
          />
        ))}
      </div>
    </>
  );
});

function Channel({
  ch,
  access,
  owner,
  count,
}: {
  ch: Doc<"channel">;
  count: number;
  access: Doc<"access">;
  owner: boolean;
}) {
  const { setOpen, setId } = useDialogCreateChannel();
  const { setIsOpen, setChannelId } = useDialogRmChannel();
  const { channel, server } = useParams<{ server: string; channel: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, toggleSidebar } = useSidebar();
  const pathname = `/server/${server}/${ch._id}`;
  const isActive = channel === ch._id;
  const router = useRouter();
  const [isTouched, setIsTouched] = useState(false);
  const hasLongPressed = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    hasLongPressed.current = false;

    timeoutRef.current = setTimeout(() => {
      setIsTouched(true);
      hasLongPressed.current = true;
    }, 300); // threshold long press, bisa disesuaikan
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();

    // ⛔ JANGAN jalanin navigasi kalau klik terjadi di tombol
    const target = e.target as HTMLElement;
    if (target.closest("button")) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!hasLongPressed.current && isMobile && isActive) {
      return toggleSidebar();
    }

    if (!hasLongPressed.current && isMobile) {
      toggleSidebar();
      router.prefetch(pathname);
      return router.push(pathname);
    }

    if (!hasLongPressed.current) {
      router.prefetch(pathname);
      return router.push(pathname);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsTouched(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      // Cleanup timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Cleanup event listener
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={cn(
        "hover:bg-accent/80 group/channel inline-flex w-full cursor-pointer items-center justify-between rounded-lg px-3",
        {
          "bg-accent": channel === ch._id,
          hidden: ch.private && !(owner && access?.read),
        },
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseUp={handleTouchEnd}
      onMouseDown={handleTouchStart}
      ref={containerRef}
    >
      {/* Displaying the channel link */}
      <div className="inline-flex w-full items-center gap-2 py-2">
        {ch.private ? (
          <LockIcon className="size-4" />
        ) : (
          <Hash className="size-4" />
        )}
        <p className="text-xs">{ch.name}</p>
      </div>

      {/* Conditionally showing buttons and other UI based on the owner's access */}
      <div className="relative h-full w-20 flex-none cursor-pointer">
        {count > 0 && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-end opacity-100 group-hover/channel:opacity-0",
              { "opacity-0": isTouched },
            )}
          >
            <div className="bg-destructive size-fit rounded-lg px-2 py-0.5 text-[10px] text-white">
              {count}
            </div>
          </div>
        )}
        <div
          className={cn(
            "absolute inset-0 flex flex-none space-x-3 opacity-0 transition-all ease-in group-hover/channel:opacity-100",
            { "opacity-100": isTouched },
          )}
        >
          {/* If owner and has create access, display the "Invite Member" button */}
          {access?.create && (
            <button className="btn btn-primary">
              <UserPlus className="size-4" />
            </button>
          )}

          {/* If owner and has update access, display the "Edit Channel" button */}
          {access?.update && (
            <button
              className="btn btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
                setId({
                  id: ch._id,
                  name: ch.name,
                  isPrivate: ch.private,
                  type: "upadate",
                });
              }}
            >
              <Edit className="size-4" />
            </button>
          )}

          {access.remove && (
            <button
              className="btn btn-primary hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen();
                setChannelId(ch._id);
              }}
            >
              <Trash2Icon className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

SidebarChannel.displayName = "SidebarDm";

export default SidebarChannel;
