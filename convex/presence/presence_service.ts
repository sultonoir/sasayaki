import { v } from "convex/values";
import { internalMutation, mutation } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";
import { internal } from "../_generated/api";

const MARK_AS_GONE_MS = 8_000;

export const update = mutation({
  args: { isOnline: v.boolean() },
  handler: async (ctx, { isOnline }) => {
    const user = await mustGetCurrentUser(ctx);
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!existing) {
      await ctx.db.insert("presence", {
        userId: user._id,
        isOnline,
        lastSeen: Date.now(),
      });
    } else {
      await ctx.db.patch(existing._id, { isOnline, lastSeen: Date.now() });
    }
  },
});

/**
 * Updates the "updated" timestamp for a given user's presence in a room.

 */
export const heartbeat = mutation({
  handler: async (ctx) => {
    const user = await mustGetCurrentUser(ctx);
    const existing = await ctx.db
      .query("presence_heartbeats")
      .withIndex("by_user", (q) => q.eq("user", user._id))
      .unique();
    const markAsGone = await ctx.scheduler.runAfter(
      MARK_AS_GONE_MS,
      internal.presence.presence_service.markAsGone,
      { user: user._id }
    );
    if (existing) {
      const watchdog = await ctx.db.system.get(existing.markAsGone);
      if (watchdog && watchdog.state.kind === "pending") {
        await ctx.scheduler.cancel(watchdog._id);
      }
      await ctx.db.patch(existing._id, {
        markAsGone,
      });
    } else {
      await ctx.db.insert("presence_heartbeats", {
        user: user._id,
        markAsGone,
      });
    }
  },
});

export const markAsGone = internalMutation({
  args: { user: v.id("users") },
  handler: async (ctx, args) => {
    const presence = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) => q.eq("userId", args.user))
      .unique();

    if (!presence) return;

    // Tambahkan pemeriksaan waktu terakhir dilihat
    const now = Date.now();
    const lastSeen = presence.lastSeen;
    const isInactive = now - lastSeen > MARK_AS_GONE_MS;

    if (presence.isOnline && isInactive) {
      await ctx.db.patch(presence._id, { isOnline: false });
    }
  },
});
