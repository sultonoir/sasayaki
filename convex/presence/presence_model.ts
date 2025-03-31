import { defineTable } from "convex/server";
import { v } from "convex/values";

export const presence = defineTable({
  userId: v.id("users"),
  isOnline: v.boolean(),
  lastSeen: v.number(),
})
  .index("by_presence_join", ["isOnline", "userId"])
  .index("by_user", ["userId"]);

export const presence_heartbeats = defineTable({
  user: v.id("users"),
  markAsGone: v.id("_scheduled_functions"),
}).index("by_user", ["user"]);
