import { defineTable } from "convex/server";
import { v } from "convex/values";

export const attachment = defineTable({
  format: v.string(),
  fileId: v.string(),
  url: v.string(),
  blur: v.string(),
  caption: v.optional(v.string()),
  messageId: v.id("message"),
}).index("by_attachment_messageid", ["messageId"]);
