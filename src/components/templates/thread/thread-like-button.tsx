import { Button } from "@/components/ui/button";
import { getRedirect } from "@/helper/getRedirect";
import { counter } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { useSession } from "@/provider/session-provider";
import { useSocket } from "@/provider/socket-provider";
import { useThreads } from "@/provider/thread-provider";
import { api } from "@/trpc/react";
import { type LikeInitialData } from "@/types";
import { Heart } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  initialdata: LikeInitialData;
  threadId: string;
};

export const ThreadLikeButton = ({ initialdata, threadId }: Props) => {
  const { socket, isConnected } = useSocket();
  const { threads } = useThreads();
  const { user } = useSession();
  const [isLiked, setIsLiked] = useState(initialdata.isUserLike);
  const newThread = threads.find((thread) => thread.id === threadId);
  const likeCount = newThread?.like ?? initialdata.count;

  const likeThread = api.like.createLikeThread.useMutation({
    onSuccess: async (data) => {
      setIsLiked(data.like.isUserLike);
      if (socket && isConnected) {
        socket.emit("thread-update", { id: threadId, like: data.like.count });
        socket.emit("notification-count", data.notification);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const unlikeThread = api.like.deleteLikeThread.useMutation({
    onSuccess: (data) => {
      setIsLiked(data.isUserLike);
      if (socket && isConnected) {
        socket.emit("thread-update", { id: threadId, like: data.count });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleclick = () => {
    if (!user) {
      return getRedirect("/signin");
    }

    if (isLiked) {
      unlikeThread.mutate({ threadId });
    } else {
      likeThread.mutate({ threadId });
    }
  };

  const isDisabled = React.useMemo(() => {
    let isdisabled = false;
    if (likeThread.isPending || unlikeThread.isPending) {
      isdisabled = true;
    }

    return isdisabled;
  }, [likeThread.isPending, unlikeThread.isPending]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleclick}
      disabled={isDisabled}
      className="group items-center gap-1 text-[14px] leading-5 text-muted-foreground hover:bg-transparent"
    >
      <div className="relative group-hover:text-danger">
        <div className="absolute left-1/2 top-1/2 z-0 size-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-danger/20 opacity-0 transition-all group-hover:opacity-100"></div>
        <Heart
          size={18}
          className={cn("relative z-10 group-hover:stroke-danger", {
            "fill-rose-500 stroke-danger": isLiked,
          })}
        />
      </div>
      {likeCount > 0 && (
        <span
          className={cn("group-hover:text-danger", {
            "text-danger": isLiked,
          })}
        >
          {counter(likeCount)}
        </span>
      )}
    </Button>
  );
};
