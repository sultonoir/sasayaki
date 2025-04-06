import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";

export const createAccess = mutation({
  args: { serverId: v.id("server"), level: v.number() },
  handler: async (ctx, { serverId, level }) => {
    const user = await mustGetCurrentUser(ctx);

    await ctx.db.insert("access", {
      serverId,
      userId: user._id,
      level,
    });
  },
});
