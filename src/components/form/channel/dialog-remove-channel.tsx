"use client";

import { CircleAlertIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDialogRmChannel } from "@/hooks/use-dialog-remove-channel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { handleError } from "@/lib/handle-eror";
import React from "react";

export default function DialogRemoveChannel() {
  const [isPending, setIsPending] = React.useState(false);
  const { isOpen, setIsOpen, channelId } = useDialogRmChannel();
  const mutate = useMutation(api.channel.channel_service.removeChannel);

  const { server } = useParams<{
    server: Id<"server">;
  }>();

  const handleRemove = async () => {
    setIsPending(true);
    try {
      await mutate({
        serverId: server,
        channelId: channelId as unknown as Id<"channel">,
      });
    } catch (error) {
      setIsPending(false);
      return handleError({ error, message: "Error remove channel" });
    }
    setIsPending(false);
    setIsOpen();
  };
  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this channel? All messages will be
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleRemove}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
