"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useThreads } from "@/provider/thread-provider";
import { MessageSquare } from "lucide-react";

import { type Thread } from "@/types";
import useCommentDialog from "@/hooks/useCommentDialog";
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
      className="group items-center gap-1 text-[14px] leading-5 text-muted-foreground hover:bg-transparent hover:text-primary"
    >
      <div className="group-hover:text-pribg-primary relative">
        <div className="absolute left-1/2 top-1/2 z-0 size-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary/20 opacity-0 transition-all group-hover:opacity-100" />
        <MessageSquare size={18} className={cn("relative z-10")} />
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
