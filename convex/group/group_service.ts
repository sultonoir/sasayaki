import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";

export const createGroup = mutation({
  args: { name: v.string(), image: v.string() },
  handler: async (ctx, { name, image }) => {
    const user = await mustGetCurrentUser(ctx);
    const groupId = await ctx.db.insert("group", {
      name,
      image,
      owner: user._id,
      createdAt: Date.now(),
    });

    await ctx.db.insert("member", {
      userId: user._id,
      groupId,
      joinedAt: Date.now(),
      role: "admin",
    });
  },
});
