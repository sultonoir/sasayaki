import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "../_generated/server";
import { asyncMap } from "convex-helpers";
import { mustGetCurrentUser } from "../user/user_service";
import { getManyFrom } from "convex-helpers/server/relationships";

/**
 * get typing for current user and chat
 * @access private
 *
 */

export const getTyping = query({
  args: { channelId: v.string() },
  handler: async (ctx, { channelId }) => {
    const user = await mustGetCurrentUser(ctx);
    const rooms = await ctx.db
      .query("typing")
      .withIndex("by_typing_rom", (q) => q.eq("roomid", channelId))
      .filter((q) => q.not(q.eq(q.field("userId"), user._id)))
      .collect();

    const users = await asyncMap(rooms, async (room) => {
      const user = await ctx.db
        .query("users")
        .withIndex("by_id", (q) => q.eq("_id", room.userId))
        .first();

      if (!user) throw new ConvexError("user not found");

      return {
        ...room,
        user,
      };
    });

    const count = users.length;

    const username = users.map((u) => u.user.name);
    if (count === 1) return `${username[0]} is typing`;
    if (count === 2) return `${username[0]} and ${username[1]} are typing`;
    if (count > 0 && count <= 5) {
      return `${username.slice(0, count - 1).join(", ")} and ${username[count - 1]} are typing`;
    }
    return undefined;
  },
});

/**
 * send typing
 * @param user roomid : string
 */

export const createTyping = mutation({
  args: { roomid: v.string() },
  handler: async (ctx, { roomid }) => {
    const user = await mustGetCurrentUser(ctx);
    const istyping = await ctx.db
      .query("typing")
      .withIndex("by_user_typing", (q) =>
        q.eq("userId", user._id).eq("roomid", roomid),
      )
      .unique();
    if (istyping) {
      await ctx.db.delete(istyping._id);
    }

    return await ctx.db.insert("typing", {
      roomid,
      userId: user._id,
      isTyping: true,
    });
  },
});

export const removeTyping = mutation({
  args: { roomid: v.string() },
  handler: async (ctx, { roomid }) => {
    const user = await mustGetCurrentUser(ctx);

    const typing = await ctx.db
      .query("typing")
      .withIndex("by_user_typing", (q) =>
        q.eq("userId", user._id).eq("roomid", roomid),
      )
      .first();

    if (!typing) {
      return;
    }

    await ctx.db.delete(typing._id);
  },
});

export const forceRemoveTyping = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const typings = await getManyFrom(
      ctx.db,
      "typing",
      "by_user_typing",
      userId,
      "userId",
    );

    if (typings.length === 0) return;

    for (const typing of typings) {
      await ctx.db.delete(typing._id);
    }
  },
});
