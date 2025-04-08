"use client";
import React from "react";
import { Button } from "../ui/button";
import { Edit, Hash, LockOpenIcon, PlusIcon, UserPlus } from "lucide-react";
import FriendIcon from "../ui/friend-icon";
import { useParams } from "next/navigation";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

const SidebarChannel = React.memo(() => {
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

  return (
    <>
      <div className="flex w-full flex-col gap-2 border-b p-2">
        <Button variant="accent">{data.name}</Button>
      </div>
      <div className="flex w-full flex-col gap-2 border-b p-2">
        <Button
          className="justify-start"
          variant="ghost"
          size="sm"
          startContent={<FriendIcon />}
        >
          Friends
        </Button>
      </div>
      <div className="group text-muted-foreground hover:text-primary-foreground flex items-center justify-between px-4 py-2 text-xs">
        <p>Text Channels</p>
        <PlusIcon className="size-3" />
      </div>
      <div className="flex grow flex-col gap-2 overflow-y-auto p-2">
        {data.channel.map((ch) => (
          <Channel
            key={ch._id}
            ch={ch}
            owner={data.owner}
            access={data.access}
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
}: {
  ch: Doc<"channel">;
  access: Doc<"access">;
  owner: boolean;
}) {
  const { channel } = useParams<{ server: string; channel: string }>();

  return (
    <div
      className={cn(
        "hover:bg-accent/80 group inline-flex w-full items-center justify-between rounded-lg px-3 py-2",
        {
          "bg-accent": channel === ch._id,
          hidden: ch.private && !(owner && access?.read),
        },
      )}
    >
      {/* Displaying the channel link */}
      <button
        className="inline-flex w-full items-center gap-2"
        // href={`/server/${server}/${ch._id}`}
      >
        {ch.private ? (
          <LockOpenIcon className="size-4" />
        ) : (
          <Hash className="size-4" />
        )}
        <p className="text-xs">{ch.name}</p>
      </button>

      {/* Conditionally showing buttons and other UI based on the owner's access */}
      <div className="flex flex-none space-x-3 opacity-0 transition-all ease-in group-hover:opacity-100">
        {/* If owner and has read access, display the private channel message */}
        {ch.private && access?.read && (
          <span className="text-sm text-gray-600">
            This is a private channel.
          </span>
        )}

        {/* If owner and has create access, display the "Invite Member" button */}
        {access?.create && (
          <button className="btn btn-primary">
            <UserPlus className="size-4" />
          </button>
        )}

        {/* If owner and has update access, display the "Edit Channel" button */}
        {access?.update && (
          <button className="btn btn-secondary">
            <Edit className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

SidebarChannel.displayName = "SidebarDm";

export default SidebarChannel;
