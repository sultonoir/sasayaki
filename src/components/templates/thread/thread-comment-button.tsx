"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useThreads } from "@/provider/thread-provider";
import { MessageSquare } from "lucide-react";

import { Thread } from "@/types";
import useCommentDialog from "@/hook/useCommentDialog";
import { counter } from "@/lib/format-number";

interface ThreadCommentProps {
  initialData: Thread;
}

const ThreadComment = ({ initialData }: ThreadCommentProps) => {
  const { setIsOpen, setThread } = useCommentDialog();
  const { threads } = useThreads();
  const newThread = threads.find((thread) => thread.id === initialData.id);
  const commentCount = newThread?.comment ?? initialData.comment;

  const handleClick = () => {
    setThread(initialData);
    setIsOpen(true);
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      size="icon"
      className="hover:bg-transparent gap-1 group text-muted-foreground items-center text-[14px] leading-5 hover:text-primary">
      <div className="relative group-hover:text-pribg-primary">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-10 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 z-0 transition-all" />
        <MessageSquare
          size={18}
          className={cn("z-10 relative")}
        />
      </div>
      {commentCount > 0 && (
        <span className={cn("group-hover:text-primary")}>
          {counter(commentCount)}
        </span>
      )}
    </Button>
  );
};

export default ThreadComment;
