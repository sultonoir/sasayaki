import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getTodos = query({
  handler: async (ctx) => {
    return await ctx.db.query("todo").order("desc").collect();
  },
});

export const createTodo = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    await ctx.db.insert("todo", { value: name });
  },
});
