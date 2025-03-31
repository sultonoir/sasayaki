import { defineTable } from "convex/server";
import { v } from "convex/values";

export const member = defineTable({
  groupId: v.id("group"),
  userId: v.id("users"),
  joinedAt: v.number(),
  role: v.string(), // "admin", "member", etc.
})
  .index("by_group", ["groupId"])
  .index("by_user", ["userId"])
  .index("by_user_group", ["userId", "groupId"]);
