import { defineTable } from "convex/server";
import { v } from "convex/values";

export const server = defineTable({
  name: v.string(),
  ownerId: v.id("users"),
  code: v.string(),
}).index("by_server_owner", ["ownerId"]);

export const serverImage = defineTable({
  format: v.string(),
  fileId: v.string(),
  url: v.string(),
  name: v.string(),
  blur: v.string(),
  serverId: v.id("server"),
}).index("by_server_image_Id", ["serverId"]);

export const serverList = defineTable({
  serverId: v.id("server"),
  userId: v.id("users"),
  hirarki: v.optional(v.number()),
})
  .index("by_server_hirarki", ["userId", "hirarki"])
  .index("by_server_list_userId", ["userId"]);
