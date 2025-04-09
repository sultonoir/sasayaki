import { defineTable } from "convex/server";
import { v } from "convex/values";

export const role = defineTable({
  serverId: v.id("server"),
  joinedAt: v.number(),
  name: v.string(),
  color: v.string(),
  userId: v.id("users"),
})
  .index("by_role_server", ["serverId"])
  .index("by_role_user", ["userId", "serverId"]);
