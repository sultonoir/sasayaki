import { defineTable } from "convex/server";
import { v } from "convex/values";

export const access = defineTable({
  userId: v.id("users"),
  serverId: v.id("server"),
  create: v.optional(v.boolean()),
  read: v.optional(v.boolean()),
  update: v.optional(v.boolean()),
  remove: v.optional(v.boolean()),
})
  .index("by_all_access", ["userId", "serverId", "read", "update", "remove"])
  .index("by_access_remove", ["userId", "serverId", "remove"])
  .index("by_access_update", ["userId", "serverId", "update"])
  .index("by_acccess_read", ["userId", "serverId", "read"])
  .index("by_access_create", ["userId", "serverId", "create"]);
