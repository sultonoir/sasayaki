import { defineTable } from "convex/server";
import { v } from "convex/values";

export const friend = defineTable({
  friendId: v.id("users"),
  ownerId: v.id("users"),
}).index("by_friend_owner", ["ownerId"]);
