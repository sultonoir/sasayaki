import { defineTable } from "convex/server";
import { v } from "convex/values";

export const role = defineTable({
  serverId: v.id("server"),
  joinedAt: v.number(),
  name: v.string(),
  color: v.string(),
}).index("by_role_server", ["serverId"]);

export const memberRole = defineTable({
  roleId: v.id("role"),
  memberId: v.id("member"),
})
  .index("by_member_role", ["memberId", "roleId"])
  .index("by_roleId", ["roleId"]);
