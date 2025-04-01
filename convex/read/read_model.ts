import { defineTable } from "convex/server";
import { v } from "convex/values";

export const read = defineTable({
  chatId: v.id("chat"),
  userId: v.id("users"),
  readAt: v.number(),
})
  .index("by_read_chatid", ["chatId"])
  .index("by_read_user_chat", ["userId", "chatId"]);
