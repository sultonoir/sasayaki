import { defineTable } from "convex/server";
import { v } from "convex/values";

export const access = defineTable({
  userId: v.id("users"),
  chatId: v.id("chat"),
  add: v.boolean(),
  update: v.boolean(),
  delete: v.boolean(),
})
  .index("by_all_access", ["userId", "chatId", "add", "update", "delete"])
  .index("by_access_delete", ["userId", "chatId", "delete"])
  .index("by_access_update", ["userId", "chatId", "update"])
  .index("by_acccess_add", ["userId", "chatId", "add"]);
