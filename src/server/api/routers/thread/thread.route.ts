import * as input from "./thread.input";
import * as service from "./thread.service";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const threadRouter = createTRPCRouter({
  getAllThreads: publicProcedure
    .input(input.GetThreadInput)
    .query(async ({ input, ctx }) => {
      return await service.getAllThreads(ctx, input);
    }),
  createThread: protectedProcedure
    .input(input.CreateThreadInput)
    .mutation(async ({ input, ctx }) => {
      return await service.createThread(ctx, input);
    }),
  deleteThread: protectedProcedure
    .input(input.DeleteThreadInput)
    .mutation(async ({ input, ctx }) => {
      return await service.deleteThread(ctx, input);
    }),
  getSingleThread: publicProcedure
    .input(input.GetSingleThreadInput)
    .query(async ({ input, ctx }) => {
      return await service.getSingleThread(ctx, input);
    }),
});
