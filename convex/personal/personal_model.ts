import { defineTable } from "convex/server";
import { v } from "convex/values";

export const personal = defineTable({
  name: v.optional(v.string()),
}).index("by_personal_name", ["name"]);

export const pm = defineTable({
  userId: v.id("users"),
  personalId: v.id("personal"),
})
  .index("by_pm_user", ["userId"])
  .index("by_personalId", ["personalId"])
  .index("by_pm_user_personal", ["userId", "personalId"]);
