import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { threadRouter } from "./routers/thread/thread.route";
import { todoRouter } from "./routers/todo/todo.route";
import { commentRouter } from "./routers/comment/comment.route";
import { likeRouter } from "./routers/like/like.route";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  thread: threadRouter,
  todo: todoRouter,
  comment: commentRouter,
  like: likeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
