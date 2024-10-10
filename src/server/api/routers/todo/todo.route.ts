import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { createId } from "@/helper/createId";

export const todoRouter = createTRPCRouter({
  getAllTodo: publicProcedure.query(async ({ ctx }) => {
    const todo = await ctx.db.todos.findMany();
    return todo;
  }),
  createTodo: publicProcedure
    .input(
      z.object({
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.db.todos.create({
        data: {
          value: input.content,
          id: createId(),
        },
      });
      return todo;
    }),
  deleteTodo: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.db.todos.delete({
        where: {
          id: input.id,
        },
      });
      return todo;
    }),
});
