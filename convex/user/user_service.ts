import { ConvexError, v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { query, QueryCtx } from "../_generated/server";
import { getServerMutual } from "../server/server_service";

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

    return {
      ...user,
    };
  },
});

export const getUser = query({
  args: { id: v.id("users"), serverId: v.id("server") },
  handler: async (ctx, { id, serverId }) => {
    const session = await mustGetCurrentUser(ctx);
    const user = await ctx.db.get(id);

    if (!user) return null;

    const banner = await ctx.db
      .query("banner")
      .withIndex("by_banner_user", (q) => q.eq("userId", user._id))
      .unique();

    const groups = await getServerMutual(ctx, session._id, user._id);
    const roles = await ctx.db
      .query("role")
      .withIndex("by_role_user", (q) =>
        q.eq("userId", user._id).eq("serverId", serverId),
      )
      .take(4);

    return {
      ...user,
      banner,
      groups,
      roles,
    };
  },
});
