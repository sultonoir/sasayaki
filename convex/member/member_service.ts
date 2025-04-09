import { v } from "convex/values";
import { query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { internalMutation } from "./member_trigger";
import { Id } from "../_generated/dataModel";

export const getMemberByServer = query({
  args: { id: v.id("server"), pctx: paginationOptsValidator },
  async handler(ctx, { id, pctx }) {
    const member = await ctx.db
      .query("member")
      .withIndex("by_member_server", (q) => q.eq("serverId", id))
      .paginate(pctx);
  },
});

export const autoAddMember = internalMutation({
  args: { userId: v.id("users"), username: v.optional(v.string()) },
  async handler(ctx, { userId, username }) {
    const serverId =
      "ph7akrv3edcd195hevxrqws4rd7dkqm1" as unknown as Id<"server">;

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
