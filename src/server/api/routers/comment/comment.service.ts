import { TRPCError } from "@trpc/server";
import type * as input from "./comment.input";
import { db } from "@/server/db";
import { createId } from "@/helper/createId";
import { type ProtectedTRPCContext } from "../../trpc";

const createNotification = async (
  notificationData: input.CreateNotification,
) => {
  const notification = await db.notification.create({
    data: {
      id: createId(10),
      ...notificationData,
    },
  });

  if (!notification) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "通知の作成に失敗しました",
    });
  }
  return notification;
};

const getNotificationCount = async (recipientId: string) => {
  const count = await db.notification.count({
    where: {
      recipientId,
      read: false,
    },
  });

  return {
    count,
    recipientId,
  };
};

export const CreateComment = async (
  ctx: ProtectedTRPCContext,
  { value, threadId }: input.CreateCommetInput,
) => {
  const userId = ctx.user.id;

  const comment = await db.comment.create({
    data: {
      id: createId(10),
      content: value,
      threadId,
      userId,
    },
    include: {
      user: {
        select: {
          username: true,
          name: true,
          image: true,
          isVerified: true,
        },
      },
    },
  });

  if (!comment) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "コメントの作成に失敗しました",
    });
  }

  const { userId: threadOwnerId } = comment;

  if (userId !== threadOwnerId) {
    await createNotification({
      threadId: comment.threadId,
      issuerId: comment.userId,
      recipientId: threadOwnerId,
      type: "COMMENT",
    });
  }

  const commentCount = await db.comment.count({
    where: {
      threadId,
    },
  });
  const notification = await getNotificationCount(threadOwnerId);

  const commentwithCount = {
    ...comment,
    count: commentCount,
  };
  // Return the comment without the thread information

  return {
    comment: commentwithCount,
    notification,
  };
};

export async function getComment({ id, cursor }: input.GetCommentInput) {
  const pageSize = 10;
  const comments = await db.comment.findMany({
    where: {
      threadId: id,
    },
    include: {
      user: {
        select: {
          username: true,
          name: true,
          image: true,
          isVerified: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const nextCursor = comments.length > pageSize ? comments[pageSize]?.id : null;

  return {
    comments: comments.slice(0, pageSize),
    nextCursor,
  };
}
