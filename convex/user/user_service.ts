import { ConvexError, v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, QueryCtx } from "../_generated/server";
import { getServerMutual } from "../server/server_service";
import { updateBanner } from "../banner/banner_service";

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
    const banner = await ctx.db
      .query("banner")
      .withIndex("by_banner_user", (q) => q.eq("userId", user._id))
      .first();

    return {
      ...user,
      banner,
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

export const searchUsername = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const user = await ctx.db
      .query("users")
      .withSearchIndex("by_user_username", (q) =>
        q.search("username", username),
      )
      .unique();
    if (user) {
      return false;
    } else {
      return true;
    }
  },
});

export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    status: v.optional(v.string()),
    username: v.optional(v.string()),
    banner: v.optional(
      v.object({
        format: v.string(),
        fileId: v.string(),
        url: v.string(),
        name: v.string(),
        blur: v.string(),
      }),
    ),
  },
  handler: async (ctx, { name, username, image, status, banner }) => {
    const user = await mustGetCurrentUser(ctx);

    await ctx.db.patch(user._id, { name, image, status, username });

    if (banner) {
      await updateBanner({ ctx, value: { ...banner, userId: user._id } });
    }
  },
});

export const removeImage = mutation({
  handler: async (ctx) => {
    const user = await mustGetCurrentUser(ctx);

    await ctx.db.patch(user._id, { image: "/avatar.png" });
  },
});
