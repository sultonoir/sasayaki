import { defineTable } from "convex/server";
import { v } from "convex/values";

export const directMessage = defineTable({
  chatId: v.id("directChat"),
  author: v.id("users"),
  body: v.string(),
  sentAt: v.number(),
  attachmentId: v.optional(v.id("_storage")),
  isRead: v.boolean(),
})
  .index("by_chat_time", ["chatId", "sentAt"])
  .index("by_chat_read", ["author", "isRead"]);

export const directAttachment = defineTable({
  type: v.string(),
  url: v.string(),
  blur: v.string(),
  groupMessageId: v.id("directMessage"),
}).index("by_groupMessage_id", ["groupMessageId"]);
