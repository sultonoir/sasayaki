import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const createMember = internalMutation({
  args: {
    members: v.array(
      v.object({
        chatId: v.id("chat"),
        userId: v.id("users"),
        role: v.string(),
      }),
    ),
  },
  handler: async (ctx, { members }) => {
    for (const member of members) {
      await ctx.db.insert("member", {
        userId: member.userId,
        chatId: member.chatId,
        joinedAt: Date.now(),
        role: member.role,
      });
    }
  },
});
