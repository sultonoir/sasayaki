import { defineTable } from "convex/server";
import { v } from "convex/values";

export const junk = defineTable({
  userId: v.id("users"),
  chatId: v.id("chat"),
}).index("by_junk_user", ["chatId", "userId"]);
