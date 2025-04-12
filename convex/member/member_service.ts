import { v } from "convex/values";
import { query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { internalMutation } from "./member_trigger";
import { Id } from "../_generated/dataModel";
import { stream } from "convex-helpers/server/stream";
import schema from "../schema";
import { getOneFrom } from "convex-helpers/server/relationships";

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
      "m975eh2embj45zdvkvdtbtx7657dtsc1" as unknown as Id<"server">;

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
