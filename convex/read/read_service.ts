import { internalMutation, mutation, QueryCtx } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";
import {
  messageAggregate,
  messageUserAggregate,
} from "../message/message_aggregate";
import { Id } from "../_generated/dataModel";
import { asyncMap } from "convex-helpers";
import { v } from "convex/values";
import { getAccessChannel } from "../channel/channel_service";
import { internal } from "../_generated/api";

export const getLastread = async (ctx: QueryCtx, channelId: string) => {
  const user = await mustGetCurrentUser(ctx);

  const read = await ctx.db
    .query("read")
    .withIndex("by_read_user_chat", (q) =>
      q.eq("userId", user._id).eq("channelId", channelId),
    )
    .first();

  return read;
};

export const createRead = mutation({
  args: { channelId: v.string() },
  async handler(ctx, { channelId }) {
    const user = await mustGetCurrentUser(ctx);

    if (!user) return null;
    await ctx.scheduler.runAfter(
      5000,
      internal.read.read_service.createInternalRead,
      {
        userId: user._id,
        channelId,
      },
    );
  },
});

export const createInternalRead = internalMutation({
  args: { channelId: v.string(), userId: v.id("users") },
  async handler(ctx, { channelId, userId }) {
    const read = await ctx.db
      .query("read")
      .withIndex("by_read_user_chat", (q) =>
        q.eq("userId", userId).eq("channelId", channelId),
      )
      .first();

    if (!read) {
      return await ctx.db.insert("read", {
        channelId,
        userId: userId,
        readAt: Date.now(),
      });
    }

    await ctx.db.patch(read._id, { readAt: Date.now() });
  },
});

export const getReadServer = async (ctx: QueryCtx, serverId: Id<"server">) => {
  const user = await mustGetCurrentUser(ctx);
  const channels = await getAccessChannel(ctx, serverId, user._id);

  const count = await asyncMap(channels, async (channel) => {
    const getRead = await getLastread(ctx, channel._id);
    const readTimestamp = getRead?.readAt || 0;

    // Get total unread count
    const totalUnread = await messageAggregate.count(ctx, {
      namespace: channel._id,
      bounds: {
        lower: { key: readTimestamp, inclusive: false },
        upper: undefined,
      },
    });

    // Get count of unread messages from current user
    const myUnread = await messageUserAggregate.count(ctx, {
      namespace: channel._id,
      bounds: {
        lower: { key: [user._id, readTimestamp], inclusive: false },
        upper: { key: [user._id, Infinity], inclusive: true },
      },
    });

    // Unread messages from others = total unread - my unread
    return totalUnread - myUnread;
  });

  return count.reduce((acc, curr) => acc + curr, 0);
};

export const getReadChannel = async (ctx: QueryCtx, channelId: string) => {
  const user = await mustGetCurrentUser(ctx);
  const getRead = await getLastread(ctx, channelId);
  const readTimestamp = getRead?.readAt || 0;

  // Get total unread count
  const totalUnread = await messageAggregate.count(ctx, {
    namespace: channelId,
    bounds: {
      lower: { key: readTimestamp, inclusive: false },
      upper: undefined,
    },
  });

  // Get count of unread messages from current user
  const myUnread = await messageUserAggregate.count(ctx, {
    namespace: channelId,
    bounds: {
      lower: { key: [user._id, readTimestamp], inclusive: false },
      upper: { key: [user._id, Infinity], inclusive: true },
    },
  });

  // Unread messages from others = total unread - my unread
  return totalUnread - myUnread;
};

export const getUnreadFromOthers = async (
  ctx: QueryCtx,
  channelId: Id<"channel">,
) => {
  const user = await mustGetCurrentUser(ctx);

  const getRead = await getLastread(ctx, channelId);
  const readTimestamp = getRead?.readAt || 0;

  // Get total unread count
  const totalUnread = await messageAggregate.count(ctx, {
    namespace: channelId,
    bounds: {
      lower: { key: readTimestamp, inclusive: false },
      upper: undefined,
    },
  });

  // Get count of unread messages from current user
  const myUnread = await messageUserAggregate.count(ctx, {
    namespace: channelId,
    bounds: {
      lower: { key: [user._id, readTimestamp], inclusive: false },
      upper: { key: [user._id, Infinity], inclusive: true },
    },
  });

  // Unread messages from others = total unread - my unread
  return totalUnread - myUnread;
};
