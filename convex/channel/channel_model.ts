import { defineTable } from "convex/server";
import { v } from "convex/values";

export const channel = defineTable({
  name: v.string(),
  private: v.boolean(),
  serverId: v.id("server"),
})
  .index("by_server_channel", ["serverId"])
  .index("by_channel_private", ["serverId", "private"]);
