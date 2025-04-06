import { ConvexError, v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { query, QueryCtx } from "../_generated/server";
import { findGroupMutual } from "../member/member_service";

export async function mustGetCurrentUser(ctx: QueryCtx): Promise<Doc<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new ConvexError("Can't get session");

  const user = await ctx.db.get(userId);
  if (!user) throw new ConvexError("Can't get current user");
  return user;
}

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db.get(userId);
  },
});

export const getSession = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;
    const presence = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!presence) return null;
    return {
      ...user,
      presence,
    };
  },
});

export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    const user = await ctx.db.get(id);

    if (!user) return null;

    const banner = await ctx.db
      .query("banner")
      .withIndex("by_banner_user", (q) => q.eq("userId", user._id))
      .unique();

    const groups = await findGroupMutual({ ctx, other: id });

    const presence = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    return {
      ...user,
      banner,
      groups,
      presence,
    };
  },
});
