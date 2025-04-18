import { defineTable } from "convex/server";
import { v } from "convex/values";

export const typing = defineTable({
  roomid: v.string(),
  userId: v.id("users"),
  isTyping: v.boolean(),
})
  .index("by_user_typing", ["userId", "roomid"])
  .index("by_typing_rom", ["roomid"]);
