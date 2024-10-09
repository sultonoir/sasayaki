import { Button } from "@/components/ui/button";
import { getRedirect } from "@/helper/getRedirect";
import { counter } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { useSession } from "@/provider/session-provider";
import { useThreads } from "@/provider/thread-provider";
import { LikeInitialData } from "@/types";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { Heart } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  initialdata: LikeInitialData;
  threadId: string;
};

export const ThreadLikeButton = ({ initialdata, threadId }: Props) => {
  const { threads } = useThreads();
  const { user } = useSession();
  const [isLiked, setIsLiked] = useState(initialdata.isUserLike);
  const newThread = threads.find((thread) => thread.id === threadId);
  const likeCount = newThread?.like ?? initialdata.count;

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-like", threadId],
    mutationFn: () => ky.post(`/v1/thread/like/${threadId}`).json<boolean>(),
    onSuccess: (data) => {
      setIsLiked(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleclick = () => {
    if (!user) {
      return getRedirect("/signin");
    }
    mutate();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleclick}
      disabled={isPending}
      className="hover:bg-transparent gap-1 group text-muted-foreground items-center text-[14px] leading-5">
      <div className="relative group-hover:text-danger">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-10 rounded-full bg-danger/20 opacity-0 group-hover:opacity-100 z-0 transition-all"></div>
        <Heart
          size={18}
          className={cn("z-10 relative group-hover:stroke-danger", {
            "fill-rose-500 stroke-danger": isLiked,
          })}
        />
      </div>
      {likeCount > 0 && (
        <span
          className={cn("group-hover:text-danger", {
            "text-danger": isLiked,
          })}>
          {counter(likeCount + 1000000)}
        </span>
      )}
    </Button>
  );
};
