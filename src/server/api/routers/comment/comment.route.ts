import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import * as input from "./comment.input";
import * as service from "./comment.service";

export const commentRouter = createTRPCRouter({
  createComment: protectedProcedure
    .input(input.CreateCommetInput)
    .mutation(
      async ({ ctx, input }) => await service.CreateComment(ctx, input),
    ),
  getComment: publicProcedure
    .input(input.GetCommentInput)
    .query(async ({ input }) => {
      const comment = await service.getComment({
        id: input.id,
        cursor: input.cursor,
      });
      return comment;
    }),
});
