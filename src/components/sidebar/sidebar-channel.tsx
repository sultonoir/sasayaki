"use client";
import React from "react";
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
import { useMutation } from "convex/react";
import { handleError } from "@/lib/handle-eror";
import { useDialogRmChannel } from "@/hooks/use-dialog-remove-channel";
import ServerDropdown from "../server/server-dropdown";

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

  const pathname = `/server/${server}/${ch._id}`;

  const roter = useRouter();

  const mutate = useMutation(api.read.read_service.createRead);
  const handleNavigate = async () => {
    try {
      await mutate({ channelId: ch._id });
    } catch (error) {
      return handleError({ error, message: "Error to navigate channel" });
    }
    roter.prefetch(pathname);
    roter.push(pathname);
  };
  return (
    <div
      className={cn(
        "hover:bg-accent/80 group inline-flex w-full items-center justify-between rounded-lg px-3",
        {
          "bg-accent": channel === ch._id,
          hidden: ch.private && !(owner && access?.read),
        },
      )}
    >
      {/* Displaying the channel link */}
      <button
        className="inline-flex w-full items-center gap-2 py-2"
        onClick={handleNavigate}
      >
        {ch.private ? (
          <LockIcon className="size-4" />
        ) : (
          <Hash className="size-4" />
        )}
        <p className="text-xs">{ch.name}</p>
      </button>

      {/* Conditionally showing buttons and other UI based on the owner's access */}
      <div className="relative h-full w-20 flex-none">
        {count > 0 && (
          <div className="absolute inset-0 flex items-center justify-end opacity-100 group-hover:opacity-0">
            <div className="bg-destructive size-fit rounded-lg px-2 py-0.5 text-[10px] text-white">
              {count}
            </div>
          </div>
        )}
        <div className="absolute inset-0 flex flex-none space-x-3 opacity-0 transition-all ease-in group-hover:opacity-100">
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
              onClick={() => {
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
              onClick={() => {
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
