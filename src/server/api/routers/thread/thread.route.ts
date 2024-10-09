import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const threadRouter = createTRPCRouter({
  thread: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.user?.id;
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const threads = await ctx.db.thread.findMany({
        include: {
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
            },
          },
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      const result = threads.map((thread) => {
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
            isUserRepost: thread.repost.some(
              (repost) => repost.userId === userId,
            ),
          },
        };
      });

      const nextCursor = threads.length > limit ? threads[limit]?.id : null;

      return {
        posts: result.slice(0, limit),
        nextCursor,
      };
    }),
  createThread: publicProcedure
    .input(
      z.object({
        content: z.string().min(1).max(140),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const thread = await ctx.db.thread.create({
        data: {
          id: Math.random().toString(),
          content: input.content,
          userId: "l7tvelht2v",
        },
      });
      return thread;
    }),
});
