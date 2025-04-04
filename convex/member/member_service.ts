import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { internalMutation } from "./member_trigger";

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

export const autoAddMember = internalMutation({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    const chatId = "n97ceste3zdjqx8vzttce8ctzh7d7yga" as unknown as Id<"chat">;

    const member = await ctx.db
      .query("member")
      .withIndex("by_user_member", (q) =>
        q.eq("userId", id).eq("chatId", chatId),
      )
      .unique();

    if (!member) {
      await ctx.db.insert("member", {
        userId: id,
        chatId,
        joinedAt: Date.now(),
        role: "member",
      });
    }
  },
});
