import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { mutation, QueryCtx } from "../_generated/server";
import { mustGetCurrentUser } from "../user/user_service";

export const getPm = async (ctx: QueryCtx, otherId: Id<"users">) => {
  const user = await mustGetCurrentUser(ctx);

  const personal = await ctx.db
    .query("pm")
    .withIndex("by_pm_user", (q) => q.eq("userId", user._id))
    .filter((q) =>
      q.and(
        q.eq(q.field("userId"), user._id),
        q.eq(q.field("userId"), otherId),
      ),
    )
    .unique();

  return personal;
};

export const createDm = mutation({
  args: { otherId: v.id("users"), body: v.string() },
  handler: async (ctx, { otherId, body }) => {
    const user = await mustGetCurrentUser(ctx);
    const personal = await getPm(ctx, otherId);

    if (!personal) {
      const personalId = await ctx.db.insert("personal", {});

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
      channelId: personal._id,
      sentAt: Date.now(),
    });
  },
});
