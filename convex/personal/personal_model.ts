import { defineTable } from "convex/server";
import { v } from "convex/values";

export const personal = defineTable({
  from: v.id("users"),
  to: v.id("users"),
}).index("by_personal_user", ["from", "to"]);
