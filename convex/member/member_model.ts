import { defineTable } from "convex/server";
import { v } from "convex/values";

export const member = defineTable({
  chatId: v.id("chat"),
  userId: v.id("users"),
  joinedAt: v.number(),
  role: v.string(), // "admin", "member", etc.
})
  .index("by_member_chatid", ["chatId"])
  .index("by_member_userid", ["userId"])
  .index("by_user_member", ["userId", "chatId"]);
