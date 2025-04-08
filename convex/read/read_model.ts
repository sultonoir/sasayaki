import { defineTable } from "convex/server";
import { v } from "convex/values";

export const read = defineTable({
  channelId: v.string(),
  userId: v.id("users"),
  readAt: v.number(),
})
  .index("by_read_channel", ["channelId"])
  .index("by_read_user_chat", ["userId", "channelId"]);
