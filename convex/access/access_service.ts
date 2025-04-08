import { v } from "convex/values";
import { mutation, QueryCtx } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";
import { Id } from "../_generated/dataModel";

export const createAccess = mutation({
  args: {
    serverId: v.id("server"),
    create: v.optional(v.boolean()),
    read: v.optional(v.boolean()),
    update: v.optional(v.boolean()),
    remove: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await mustGetCurrentUser(ctx);

    await ctx.db.insert("access", { ...args, userId: user._id });
  },
});

export const getAccessUpdate = async (ctx: QueryCtx, id: string) => {
  const user = await mustGetCurrentUser(ctx);
  const channelId = id as unknown as Id<"channel">;

  const channel = await ctx.db.get(channelId);

  if (!channel) return null;

  const haveAccess = await ctx.db
    .query("access")
    .withIndex("by_access_remove", (q) =>
      q
        .eq("userId", user._id)
        .eq("serverId", channel.serverId)
        .eq("remove", true),
    )
    .first();

  if (!haveAccess) return null;

  return haveAccess;
};

export const getAccess = async (ctx: QueryCtx, id: Id<"server">) => {
  const user = await mustGetCurrentUser(ctx);

  const haveAccess = await ctx.db
    .query("access")
    .withIndex("by_access_remove", (q) =>
      q.eq("userId", user._id).eq("serverId", id),
    )
    .first();

  if (!haveAccess) return null;

  return haveAccess;
};
