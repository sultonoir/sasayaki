import { createId } from "@/helper/createId";
import type * as input from "./like.input";
import { db } from "@/server/db";
import { type ProtectedTRPCContext } from "../../trpc";
import { TRPCError } from "@trpc/server";
import {
  createNotification,
  getNotificationCount,
} from "../notifi/notifi.service";

const formatLikeResponse = async ({
  threadId,
  userId,
}: input.FormatLikeResponse) => {
  const likes = await db.like.findMany({ where: { threadId } });

  return {
    count: likes.length,
    isUserLike: likes.some((like) => like.userId === userId),
    threadId,
  };
};

export const createLikeThread = async ({
  ctx,
  input,
}: {
  ctx: ProtectedTRPCContext;
  input: input.LikeThreadInput;
}) => {
  const userId = ctx.user.id;

  // Find the thread
  const thread = await db.thread.findUnique({
    where: { id: input.threadId },
  });

  if (!thread) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "スレッドが見つかりませんでした", // "Thread not found"
    });
  }

  // Create a like
  const like = await db.like.create({
    data: {
      id: createId(10),
      userId,
      threadId: input.threadId,
    },
  });

  if (!like) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "スレッドに「いいね！」を付けることができませんでした", // "Could not like the thread"
    });
  }

  // Check for existing notification
  const existingNotification = await db.notification.findFirst({
    where: {
      threadId: input.threadId,
      type: "LIKE",
      issuerId: userId,
    },
  });

  // Create notification if it doesn't exist
  if (!existingNotification) {
    await createNotification({
      threadId: input.threadId,
      issuerId: userId,
      recipientId: thread.userId,
      type: "LIKE",
    });
  }

  // Get notification count
  const notificationCount = await getNotificationCount({
    recipientId: thread.userId,
  });

  // Format like response
  const likeCount = await formatLikeResponse({
    userId,
    threadId: input.threadId,
  });

  return {
    like: likeCount,
    notification: notificationCount,
  };
};

export const deleteLikeThread = async ({
  ctx,
  input,
}: {
  ctx: ProtectedTRPCContext;
  input: input.LikeThreadInput;
}) => {
  const userId = ctx.user.id;

  const deletelike = await db.like.deleteMany({
    where: {
      threadId: input.threadId,
      userId,
    },
  });

  if (!deletelike) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "スレッドから「いいね！」を削除することができませんでした", // "Could not delete the like"
    });
  }

  return formatLikeResponse({threadId: input.threadId, userId});
};
