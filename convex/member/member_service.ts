import { ConvexError, v } from "convex/values";
import { query, QueryCtx } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { internalMutation, mutation } from "./member_trigger";
import { Id } from "../_generated/dataModel";
import { stream } from "convex-helpers/server/stream";
import schema from "../schema";
import { getOneFrom } from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";

export const getMemberByServer = query({
  args: { id: v.id("server"), paginationOpts: paginationOptsValidator },
  async handler(ctx, { id, paginationOpts }) {
    const members = stream(ctx.db, schema)
      .query("member")
      .withIndex("by_member_server", (q) => q.eq("serverId", id))
      .order("desc")
      .map(async (member) => {
        const user = await ctx.db.get(member.userId);

        if (!user) {
          return null;
        }

        const profile = await getOneFrom(
          ctx.db,
          "userImage",
          "by_user_image",
          user._id,
          "userId",
        );

        return {
          ...member,
          user,
          profile,
        };
      });

    return members.paginate(paginationOpts);
  },
});

export const autoAddMember = internalMutation({
  args: { userId: v.id("users"), username: v.optional(v.string()) },
  async handler(ctx, { userId, username }) {
    const serverId =
      "m97ds9ce54atkd0msdvxxf8zen7dyk55" as unknown as Id<"server">;

    const server = await ctx.db.get(serverId);

    if (!server) return;

    const member = ctx.db.insert("member", {
      serverId,
      userId,
      username,
      joinedAt: Date.now(),
    });

    const access = ctx.db.insert("access", {
      serverId,
      userId,
      read: false,
      update: false,
      create: false,
      remove: false,
    });

    Promise.all([access, member]);
  },
});

export async function getMemberUsername(
  ctx: QueryCtx,
  userId: Id<"users">,
  serverId?: Id<"server">,
) {
  if (!serverId) return undefined;

  const member = await ctx.db
    .query("member")
    .withIndex("by_user_member", (q) =>
      q.eq("userId", userId).eq("serverId", serverId),
    )
    .unique();
  return member?.username;
}

export async function getSearchMember(
  ctx: QueryCtx,
  serverId: Id<"server">,
  body: string,
) {
  if (!serverId) return [];

  const queries = await ctx.db
    .query("member")
    .withSearchIndex("by_serarch_member_username", (q) =>
      q.search("username", body).eq("serverId", serverId),
    )
    .collect();
  const members = await asyncMap(queries, async (q) => {
    const user = await ctx.db.get(q.userId);

    if (!user) return null;
    const profile = await getOneFrom(
      ctx.db,
      "userImage",
      "by_user_image",
      q.userId,
      "userId",
    );

    return {
      ...q,
      user,
      profile,
    };
  });

  return members.filter((f) => f !== null);
}

export const joinServer = mutation({
  args: {
    serverId: v.id("server"),
    userId: v.id("users"),
    username: v.optional(v.string()),
  },
  handler: async (ctx, { serverId, userId, username }) => {
    const server = await ctx.db.get(serverId);

    if (!server) return;

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new ConvexError("user not found");
    }

    const member = ctx.db.insert("member", {
      serverId,
      userId,
      username,
      joinedAt: Date.now(),
    });

    const access = ctx.db.insert("access", {
      serverId,
      userId,
      read: false,
      update: false,
      create: false,
      remove: false,
    });

    Promise.all([access, member]);
  },
});
