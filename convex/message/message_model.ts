import { defineTable } from "convex/server";
import { v } from "convex/values";

export const message = defineTable({
  channelId: v.string(),
  userId: v.id("users"),
  body: v.optional(v.string()),
  parentId: v.optional(v.id("message")),
  sentAt: v.number(),
})
  .index("by_message_channel", ["channelId", "sentAt"])
  .index("parentId", ["parentId"]);
