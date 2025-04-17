import { defineTable } from "convex/server";
import { v } from "convex/values";

export const member = defineTable({
  serverId: v.id("server"),
  userId: v.id("users"),
  joinedAt: v.number(),
  username: v.optional(v.string()),
})
  .index("by_member_server", ["serverId"])
  .index("by_member_userid", ["userId"])
  .index("by_user_member", ["userId", "serverId"])
  .searchIndex("by_serarch_member_username", {
    filterFields: ["serverId"],
    searchField: "username",
  });
