import { Button } from "@/components/ui/button";
import { getRedirect } from "@/helper/getRedirect";
import { counter } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { useSession } from "@/provider/session-provider";
import { useThreads } from "@/provider/thread-provider";
import { RepostInitialData } from "@/types";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { Repeat } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  initialdata: RepostInitialData;
  threadId: string;
};

export const ThreadRepostButton = ({ threadId, initialdata }: Props) => {
  const { user } = useSession();
  const [isReposted, setIsReposted] = useState(initialdata.isUserRepost);
  const { threads } = useThreads();
  const newThread = threads.find((thread) => thread.id === threadId);
  const repostCount = newThread?.repost ?? initialdata.count;

  const { mutate, isPending } = useMutation({
    mutationKey: ["repost", threadId],
    mutationFn: () => ky.post(`/v1/thread/repost/${threadId}`).json<boolean>(),
    onSuccess: (data) => {
      setIsReposted(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleclick = async () => {
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
      className="hover:bg-transparent gap-1 group text-muted-foreground">
      <div className="relative group-hover:text-success">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-10 rounded-full bg-success/20 opacity-0 group-hover:opacity-100 z-0 transition-all" />
        <Repeat
          size={18}
          className={cn(
            "z-10 relative group-hover:stroke-success text-muted-foreground",
            {
              "text-success": isReposted,
            }
          )}
        />
      </div>
      {repostCount > 0 && (
        <span
          className={cn("group-hover:text-success", {
            "text-success": isReposted,
          })}>
          {counter(repostCount + 1000000)}
        </span>
      )}
    </Button>
  );
};
