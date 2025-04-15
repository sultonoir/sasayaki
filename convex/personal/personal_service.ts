import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { mutation, query, QueryCtx } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";
import { stream } from "convex-helpers/server/stream";
import schema from "../schema";
import { getReadChannel } from "../read/read_service";
import { getOneFrom } from "convex-helpers/server/relationships";
import { mutation as messagemutation } from "../message/message_trigger";

export const getPm = async (ctx: QueryCtx, otherId: Id<"users">) => {
  const user = await mustGetCurrentUser(ctx);

  // Get all personal conversations the current user is part of
  const userPms = await ctx.db
    .query("pm")
    .withIndex("by_pm_user", (q) => q.eq("userId", user._id))
    .collect();

  // Find if the other user is in any of these conversations
  for (const personals of userPms) {
    const sharedPersonal = await ctx.db
      .query("pm")
      .withIndex("by_pm_user_personal", (q) =>
        q.eq("userId", otherId).eq("personalId", personals.personalId)
      )
      .unique();

    if (sharedPersonal) {
      return sharedPersonal.personalId;
    }
  }

  return undefined;
};

export const createDm = messagemutation({
  args: { otherId: v.id("users"), body: v.string() },
  handler: async (ctx, { otherId, body }) => {
    const user = await mustGetCurrentUser(ctx);
    const personal = await getPm(ctx, otherId);

    if (!personal) {
      const personalId = await ctx.db.insert("personal", {});

      await ctx.db.insert("pm", { userId: user._id, personalId });
      await ctx.db.insert("pm", { userId: otherId, personalId });

      await ctx.db.insert("message", {
        userId: user._id,
        channelId: personalId,
        sentAt: Date.now(),
        body,
      });
      return;
    }

    await ctx.db.insert("message", {
      userId: user._id,
      body,
      channelId: personal,
      sentAt: Date.now(),
    });
  },
});

export const getDm = mutation({
  args: { otherId: v.id("users") },
  handler: async (ctx, { otherId }) => {
    const user = await mustGetCurrentUser(ctx);
    const personal = await getPm(ctx, otherId);

    if (!personal) {
      const personalId = await ctx.db.insert("personal", {});

      await ctx.db.insert("pm", { userId: user._id, personalId });
      await ctx.db.insert("pm", { userId: otherId, personalId });

      return {
        personalId,
        otherId,
      };
    }

    return {
      personalId: personal,
      otherId,
    };
  },
});

export const getNewDms = query({
  handler: async (ctx) => {
    const user = await mustGetCurrentUser(ctx);
    const personalMessages = stream(ctx.db, schema)
      .query("pm")
      .withIndex("by_pm_user", (q) => q.eq("userId", user._id))
      .map(async (pm) => {
        // Get the last message for this personal conversation
        const lastMessage = await ctx.db
          .query("message")
          .withIndex("by_message_channel", (q) =>
            q.eq("channelId", pm.personalId)
          )
          .filter((q) => q.neq(q.field("userId"), user._id))
          .order("desc")
          .first(); // Take only the first (most recent) message

        if (!lastMessage) return null;
        const other = await ctx.db.get(lastMessage.userId);
        if (!other) return null;

        const profile = await getOneFrom(
          ctx.db,
          "userImage",
          "by_user_image",
          lastMessage.userId,
          "userId"
        );
        const count = await getReadChannel(ctx, pm.personalId);

        return {
          id: pm.personalId,
          image: profile?.url,
          userId: other._id,
          name: other.name,
          blur: profile?.blur,
          online: other.online,
          count,
        };
      })
      .filterWith(async (f) => {
        const count = await getReadChannel(ctx, f.id);
        return count !== 0;
      });

    return await personalMessages.take(4);
  },
});

export const getDms = query({
  handler: async (ctx) => {
    const user = await mustGetCurrentUser(ctx);
    const userPms = stream(ctx.db, schema)
      .query("pm")
      .withIndex("by_pm_user", (q) => q.eq("userId", user._id))
      .map(async (pm) => {
        const otherMember = await ctx.db
          .query("pm")
          .withIndex("by_personalId", (q) => q.eq("personalId", pm.personalId))
          .filter((q) => q.neq(q.field("userId"), user._id))
          .unique();

        if (!otherMember) return null;
        const other = await ctx.db.get(otherMember.userId);
        if (!other) return null;

        const profile = await getOneFrom(
          ctx.db,
          "userImage",
          "by_user_image",
          otherMember.userId,
          "userId"
        );
        const count = await getReadChannel(ctx, pm.personalId);

        return {
          id: pm.personalId,
          image: profile?.url,
          userId: other._id,
          name: other.name,
          blur: profile?.blur,
          online: other.online,
          count,
        };
      });

    return userPms.collect();
  },
});
