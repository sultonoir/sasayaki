import { defineTable } from "convex/server";
import { v } from "convex/values";

export const directChat = defineTable({
  from: v.id("users"),
  to: v.id("users"),
  createdAt: v.number(),
})
  .index("by_sender", ["from"]) // For finding a user's direct chats
  .index("by_participants", ["from", "to"]);
