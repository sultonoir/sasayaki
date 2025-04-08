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
