import { createTRPCRouter, protectedProcedure } from "../../trpc";
import * as input from "./like.input";
import * as service from "./like.service";

export const likeRouter = createTRPCRouter({
  createLikeThread: protectedProcedure
    .input(input.LikeThreadInput)
    .mutation(async ({ input, ctx }) => {
      return await service.createLikeThread({ ctx, input });
    }),
  deleteLikeThread: protectedProcedure
    .input(input.LikeThreadInput)
    .mutation(async ({ input, ctx }) => {
      return await service.deleteLikeThread({ ctx, input });
    }),
});
