import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { asyncMap } from "convex-helpers";
import { mustGetCurrentUser } from "../user/user_service";

/**
 * get typing for current user and chat
 * @access private
 *
 */

export const getTyping = query({
  args: { chatId: v.string() },
  handler: async (ctx, { chatId }) => {
    const user = await mustGetCurrentUser(ctx);
    const rooms = await ctx.db
      .query("typing")
      .withIndex("by_typing_rom", (q) => q.eq("roomid", chatId))
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
    if (count === 1) return `${users[0]} is typing`;
    if (count === 2) return `${users[0]} and ${users[1]} are typing`;
    if (count <= 5) {
      return `${users.slice(0, count - 1).join(", ")} and ${users[count - 1]} are typing`;
    }

    return `${users.slice(0, 3).join(", ")} and ${count - 3} others are typing`;
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
    await ctx.db.insert("typing", {
      roomid,
      userId: user._id,
      isTyping: false,
    });
  },
});

export const removeTyping = mutation({
  handler: async (ctx) => {
    const user = await mustGetCurrentUser(ctx);

    const typing = await ctx.db
      .query("typing")
      .withIndex("by_user_typing", (q) => q.eq("userId", user._id))
      .first();

    if (!typing) {
      return;
    }

    await ctx.db.delete(typing._id);
  },
});
