import { defineTable } from "convex/server";
import { v } from "convex/values";

export const groupRead = defineTable({
  messageId: v.id("groupMessage"),
  userId: v.id("users"),
  readAt: v.number(),
})
  .index("by_message", ["messageId"])
  .index("by_user_message", ["userId", "messageId"]);
