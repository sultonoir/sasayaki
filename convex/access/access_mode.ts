import { defineTable } from "convex/server";
import { v } from "convex/values";

export const access = defineTable({
  userId: v.id("users"),
  serverId: v.id("server"),
  level: v.number(),
}).index("by_all_access", ["userId", "serverId", "level"]);
