import { defineTable } from "convex/server";
import { v } from "convex/values";

export const message = defineTable({
  chatId: v.id("chat"),
  userId: v.id("users"),
  body: v.optional(v.string()),
  parentId: v.optional(v.id("message")),
  sentAt: v.number(),
})
  .index("by_chat_time", ["chatId", "sentAt"])
  .index("parentId", ["parentId"]);
