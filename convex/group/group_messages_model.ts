import { defineTable } from "convex/server";
import { v } from "convex/values";

export const groupMessage = defineTable({
  chatId: v.id("group"),
  senderId: v.id("users"),
  body: v.string(),
  sentAt: v.number(),
  attachmentId: v.optional(v.id("_storage")),
}).index("by_chat_time", ["chatId", "sentAt"]);

export const groupAttachment = defineTable({
  format: v.string(),
  fileId: v.string(),
  url: v.string(),
  blur: v.string(),
  groupMessageId: v.id("groupMessage"),
}).index("by_groupMessage_id", ["groupMessageId"]);
