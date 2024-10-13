"use client";
import { useSession } from "@/provider/session-provider";
import React from "react";
import UserAvatar from "../../user/user-avatar";
import { ButtonLoading } from "../../button/button-loading";
import { toast } from "sonner";
import useCommentDialog from "@/hooks/useCommentDialog";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useSocket } from "@/provider/socket-provider";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  threadId: string;
  type: "dialog" | "field";
}

export function FormComment({ threadId, type, className }: Props) {
  const { socket, isConnected } = useSocket();
  const { setIsOpen } = useCommentDialog();
  const { user } = useSession();
  const [value, setValue] = React.useState("");
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${e.target.scrollHeight - 1}px`;
      setValue(ref.current.value);
    }
  };

  const { mutateAsync, isPending } = api.comment.createComment.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: async (data) => {
      if (socket && isConnected) {
        socket.emit("comment", data.comment);
        socket.emit("notification-count", data.notification);
        socket.emit("thread-update", {
          id: data.comment.threadId,
          comment: data.comment.count,
        });
      }
      setIsOpen(false);
      setValue("");
    },
  });

  const handleSubmit = async () => {
    await mutateAsync({
      value,
      threadId,
    });
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-4">
        <UserAvatar avatarUrl={user?.image} size={40} />
        <textarea
          ref={ref}
          rows={1}
          maxLength={550}
          value={value}
          onInput={handleInput}
          className="min-h-10 w-full resize-none bg-transparent outline-none focus:outline-none"
          placeholder="Reply..."
        />
        {type === "field" && (
          <ButtonLoading
            onClick={handleSubmit}
            loading={isPending}
            disabled={value.trim() === ""}
          >
            Reply
          </ButtonLoading>
        )}
      </div>
      {type === "dialog" && (
        <ButtonLoading
          onClick={handleSubmit}
          loading={isPending}
          disabled={value.trim() === ""}
        >
          Reply
        </ButtonLoading>
      )}
    </div>
  );
}
