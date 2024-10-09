import { createId } from "@/helper/createId";
import type * as input from "./thread,input";
import { db } from "@/server/db";
import { type ProtectedTRPCContext, type PublicTRPCContext } from "../../trpc";

// Helper function to format thread response
const formatThreadResponse = ({
  thread,
  userId,
}: {
  thread: input.FormatResult;
  userId?: string;
}) => {
  return {
    ...thread,
    comment: thread.comment.length,
    isBookmarked: thread.bookmark.some(
      (bookmark) => bookmark.userId === userId,
    ),
    like: {
      count: thread.like.length,
      isUserLike: thread.like.some((like) => like.userId === userId),
    },
    repost: {
      count: thread.repost.length,
      isUserRepost: thread.repost.some((repost) => repost.userId === userId),
    },
  };
};

// Helper function to include common relations in queries
const threadIncludes = {
  like: true,
  comment: true,
  repost: true,
  media: true,
  bookmark: true,
  user: {
    select: {
      name: true,
      username: true,
      image: true,
      isVerified: true,
    },
  },
};

export const createThread = async (
  ctx: ProtectedTRPCContext,
  { content, Media }: input.CreateThreadInput,
) => {
  const userId = ctx.user.id;
  const thread = await db.thread.create({
    data: {
      id: createId(10),
      content,
      userId,
    },
    include: threadIncludes,
  });

  if (Media.length > 0) {
    await createThreadMedia({ id: thread.id, media: Media, userId });
  }

  return formatThreadResponse({ thread, userId });
};

export const createThreadMedia = async ({
  id,
  media,
  userId,
}: input.CreateThreadMediaInput) => {
  const mediaUpload = media.map((item) => ({
    id: createId(10),
    imageUrl: item,
    thumbnail: item,
  }));

  const thread = await db.thread.update({
    where: { id },
    data: {
      media: {
        createMany: {
          data: mediaUpload,
        },
      },
    },
    include: threadIncludes,
  });

  return formatThreadResponse({ thread, userId });
};

export const getAllThreads = async (
  ctx: PublicTRPCContext,
  { cursor, limit }: input.GetThreadInput,
) => {
  const userId = ctx.user?.id;
  const threads = await db.thread.findMany({
    include: threadIncludes,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const nextCursor = threads.length > limit ? threads[limit]?.id : null;

  const formattedThreads = threads
    .slice(0, limit)
    .map((thread) => formatThreadResponse({ thread, userId }));

  return {
    posts: formattedThreads,
    nextCursor,
  };
};

export const getSingleThread = async (
  ctx: PublicTRPCContext,
  { id }: input.GetSingleThreadInput,
) => {
  const userId = ctx.user?.id;
  const thread = await db.thread.findUnique({
    where: { id },
    include: threadIncludes,
  });

  return thread ? formatThreadResponse({ thread, userId }) : null;
};

export const deleteThread = async (
  ctx: ProtectedTRPCContext,
  { id }: input.DeleteThreadInput,
) => {
  const userId = ctx.user.id;
  const thread = await db.thread.delete({
    where: { id, userId },
    include: threadIncludes,
  });

  return formatThreadResponse({ thread, userId });
};
