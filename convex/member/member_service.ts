import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const createMember = internalMutation({
  args: {
    members: v.array(
      v.object({
        groupId: v.id("group"),
        userId: v.id("users"),
        role: v.string(),
      }),
    ),
  },
  handler: async (ctx, { members }) => {
    for (const member of members) {
      await ctx.db.insert("member", {
        userId: member.userId,
        groupId: member.groupId,
        joinedAt: Date.now(),
        role: member.role,
      });
    }
  },
});
