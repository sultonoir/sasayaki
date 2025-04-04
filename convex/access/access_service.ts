import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";

export const createAccess = mutation({
  args: { chatId: v.id("chat") },
  handler: async (ctx, { chatId }) => {
    const user = await mustGetCurrentUser(ctx);

    await ctx.db.insert("access", {
      chatId,
      userId: user._id,
      add: true,
      update: true,
      delete: true,
    });
  },
});
