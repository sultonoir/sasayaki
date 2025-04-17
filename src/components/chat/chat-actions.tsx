import { Messages } from "@/types";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Reply, Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { handleError } from "@/lib/handle-eror";
import { useChat } from "@/hooks/use-chat";
import { toast } from "sonner";

interface Props {
  message: Messages;
}

const ChatActions = ({ message }: Props) => {
  const { setReply, setShift } = useChat();

  //pending
  const [isPending, setIsPending] = useState(false);

  //api mutation
  const mutate = useMutation(api.message.message_service.removeMessage);

  const handleRemoveImage = async () => {
    if (message.attachment.length === 0) return;
    const result = await fetch("/api/attachments", {
      method: "DELETE",
      body: JSON.stringify({
        fileIds: message.attachment.map((item) => item.fileId),
      }),
    });

    if (!result.ok) {
      toast.error("Failed to upload files");
      return;
    }
  };
  //handle remove message
  const handleRemoveMessage = async () => {
    setIsPending(true);
    try {
      await handleRemoveImage();
      await mutate({
        id: message._id,
        attachments: message.attachment.map((item) => item._id),
      });
    } catch (error) {
      setIsPending(false);
      return handleError({ error, message: "Error remove message" });
    }
    setShift(false);
    setIsPending(false);
  };

  //handle reply
  const handleReply = () => {
    setReply(message);
  };
  return (
    <div className="group-hover/message:bg-card group-active/message:bg-card bg-card absolute -top-4 right-10 flex translate-y-2 scale-95 items-center gap-1 rounded-lg border p-1 opacity-0 transition-all duration-300 ease-out group-hover/message:translate-y-0 group-hover/message:scale-100 group-hover/message:opacity-100 group-active/message:translate-y-0 group-active/message:scale-100 group-active/message:opacity-100">
      <Button
        variant="ghost"
        size="icon"
        className="size-7 disabled:opacity-100"
        aria-label="Reply message"
        title="Reply message"
        onClick={handleReply}
      >
        <Reply />
      </Button>
      {message.access && (
        <Button
          variant="destructive"
          size="icon"
          className="size-7 text-white disabled:opacity-100"
          aria-label="Remove message"
          title="Remove message"
          disabled={isPending}
          loading={isPending}
          onClick={handleRemoveMessage}
          startContent={<Trash2 />}
        />
      )}
    </div>
  );
};

export default ChatActions;
