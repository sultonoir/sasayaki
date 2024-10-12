import { type CommentWithUser } from "@/types";
import React from "react";
import UserAvatar from "../user/user-avatar";
import { formatRelativeDate } from "@/lib/format-relative-date";
import Linkify from "@/components/ui/linkify";
import { useSession } from "@/provider/session-provider";

type Props = {
  comment: CommentWithUser;
  ownerId: string;
};

export const CommentCard = ({ comment, ownerId }: Props) => {
  const { user } = useSession();
  const isHaveAccess = user?.id === ownerId || comment.userId === user?.id;

  return (
    <section className="group/post flex gap-3 p-5 py-3">
      <div className="relative z-10 h-fit flex-shrink-0">
        <UserAvatar avatarUrl={comment.user.image} size={40} />
      </div>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-2 text-[15px] leading-5">
          <p className="relative z-10 block font-bold capitalize text-foreground hover:underline">
            {comment.user.name}
          </p>
          <p className="text-muted-foreground">@{comment.user.username}</p>
          <p className="text-muted-foreground">•</p>
          <p
            className="block text-sm text-muted-foreground hover:underline"
            suppressHydrationWarning
          >
            {formatRelativeDate(new Date(comment.createdAt))}
          </p>
        </div>
        <Linkify>
          <div className="whitespace-pre-line break-words">
            {comment.content}
          </div>
        </Linkify>
      </div>
      {/* {isHaveAccess ? (
        <CommentDeleteDialog
          threadId={comment.threadId}
          ownerId={ownerId}
          commentId={comment.id}
          className="relative z-10 flex-shrink-0 opacity-0 transition-opacity group-hover/post:opacity-100"
        />
      ) : (
        <div className="w-9" />
      )} */}
    </section>
  );
};
