import { CommentWithUser } from "@/types";
import React from "react";
import { UserHoverCard } from "../user/user-hover-card";
import UserAvatar from "../user/user-avatar";
import { formatRelativeDate } from "@/lib/format-relative-date";
import Linkify from "@/components/ui/linkify";
import { useSession } from "@/provider/session-provider";
import { CommentDeleteDialog } from "./comment-delete-dialog";

type Props = {
  comment: CommentWithUser;
  ownerId: string;
};

export const CommentCard = ({ comment, ownerId }: Props) => {
  const { user } = useSession();
  const isHaveAccess = user?.id === ownerId || comment.userId === user?.id;

  return (
    <section className="group/post flex gap-3 py-3 p-5">
      <UserHoverCard username={comment.user.username}>
        <div className="h-fit flex-shrink-0 relative z-10">
          <UserAvatar
            avatarUrl={comment.user.image}
            size={40}
          />
        </div>
      </UserHoverCard>
      <div className="flex flex-col flex-grow">
        <div className="flex gap-2 text-[15px] leading-5">
          <UserHoverCard username={comment.user.username}>
            <p className="block hover:underline text-foreground font-bold capitalize relative z-10">
              {comment.user.name}
            </p>
          </UserHoverCard>
          <p className="text-muted-foreground">@{comment.user.username}</p>
          <p className="text-muted-foreground">•</p>
          <p
            className="block text-sm text-muted-foreground hover:underline"
            suppressHydrationWarning>
            {formatRelativeDate(new Date(comment.createdAt))}
          </p>
        </div>
        <Linkify>
          <div className="whitespace-pre-line break-words">
            {comment.content}
          </div>
        </Linkify>
      </div>
      {isHaveAccess ? (
        <CommentDeleteDialog
          threadId={comment.threadId}
          ownerId={ownerId}
          commentId={comment.id}
          className="opacity-0 transition-opacity group-hover/post:opacity-100 flex-shrink-0 relative z-10"
        />
      ) : (
        <div className="w-9" />
      )}
    </section>
  );
};
