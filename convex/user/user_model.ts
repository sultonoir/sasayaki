import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userImage = defineTable({
  format: v.string(),
  fileId: v.string(),
  url: v.string(),
  name: v.string(),
  blur: v.string(),
  userId: v.id("users"),
}).index("by_user_image", ["userId", "url"]);
